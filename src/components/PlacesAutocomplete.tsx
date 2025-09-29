import { useState, useEffect, useRef } from 'react'
import { MapPin, X, Check } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

interface PlacesAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelect?: (place: {
    address: string
    coordinates: { lat: number; lng: number }
    components: google.maps.GeocoderAddressComponent[]
  }) => void
  placeholder?: string
  className?: string
  restrictToCities?: string[]
}

interface NewPlaceSuggestion {
  placePrediction: {
    place: string
    placeId: string
    text: {
      text: string
    }
    structuredFormat: {
      mainText: { text: string }
      secondaryText: { text: string }
    }
  }
}

export function PlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = 'Enter an address...',
  className,
  restrictToCities = ['Lagos', 'Abuja']
}: PlacesAutocompleteProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [suggestions, setSuggestions] = useState<NewPlaceSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<number>()
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)

  // Load Google Maps script with Places API (New)
  useEffect(() => {
    if (window.google?.maps?.places) {
      setIsLoaded(true)
      initializeSession()
      return
    }

    const script = document.createElement('script')
    const callbackName = 'initGoogleMaps' + Date.now()
    
    // Define global callback
    ;(window as any)[callbackName] = () => {
      if (window.google?.maps?.places) {
        setIsLoaded(true)
        initializeSession()
      } else {
        console.error('PlacesAutocomplete: Places API still not available after load')
      }
      
      // Clean up global callback
      delete (window as any)[callbackName]
    }

    // Load with both legacy and new Places API libraries
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=${callbackName}&v=weekly`
    script.async = true
    script.defer = true
    script.onerror = (error) => {
      console.error('PlacesAutocomplete: Failed to load Google Maps script', error)
    }
    
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      if ((window as any)[callbackName]) {
        delete (window as any)[callbackName]
      }
    }
  }, [])

  const initializeSession = () => {
    if (window.google?.maps?.places?.AutocompleteSessionToken) {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken()
    }
  }

  const searchPlacesNew = async (input: string) => {
    try {
      const requestBody = {
        input,
        locationBias: {
          circle: {
            center: {
              latitude: 8.6753, // Center of Nigeria
              longitude: 9.0820
            },
            radius: 50000 // 50 km (max value)
          }
        },
        includedRegionCodes: ['NG'], // restrict to Nigeria
        includedPrimaryTypes: ['street_address', 'premise', 'subpremise'],
        sessionToken: (sessionTokenRef.current as any)?.token
      }

      const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Places API error response:', errorData)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.suggestions) {
        // Filter suggestions to only include allowed cities
        const filteredSuggestions = data.suggestions.filter((suggestion: NewPlaceSuggestion) => {
          if (restrictToCities.length === 0) return true
          
          // Check both the main text and secondary text for city names
          const mainText = suggestion.placePrediction.structuredFormat?.mainText?.text || ''
          const secondaryText = suggestion.placePrediction.structuredFormat?.secondaryText?.text || ''
          const fullText = suggestion.placePrediction.text?.text || ''
          
          const searchText = `${mainText} ${secondaryText} ${fullText}`.toLowerCase()
          
          const isAllowed = restrictToCities.some(city => 
            searchText.includes(city.toLowerCase())
          )
          
          return isAllowed
        })

        setSuggestions(filteredSuggestions)
      } else {
        setSuggestions([])
      }
    } catch (error) {
      console.error('PlacesAutocomplete: Places API error:', error)
      setSuggestions([])
    }
  }

  const searchPlaces = async (input: string) => {
    if (!input.trim()) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    await searchPlacesNew(input)
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setShowSuggestions(true)

    // Debounce the search
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }

    debounceRef.current = window.setTimeout(() => {
      searchPlaces(newValue)
    }, 300)
  }

  const getPlaceDetails = async (placeId: string): Promise<any> => {
    try {
      // Remove 'places/' prefix if present
      const cleanPlaceId = placeId.replace('places/', '')
      
      const response = await fetch(`https://places.googleapis.com/v1/places/${cleanPlaceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,addressComponents,location'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Places API details error:', response.status, errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Places API details error:', error)
      throw error
    }
  }

  const handleSelect = async (suggestion: NewPlaceSuggestion) => {
    
    const placeId = suggestion.placePrediction.placeId
    const fullAddress = suggestion.placePrediction.text?.text || ''
    const mainText = suggestion.placePrediction.structuredFormat?.mainText?.text || ''
    const secondaryText = suggestion.placePrediction.structuredFormat?.secondaryText?.text || ''
    
    // Use the full address text for city checking, not the place ID
    const addressText = `${mainText} ${secondaryText} ${fullAddress}`.toLowerCase()
    
    const isInAllowedCity = restrictToCities.length === 0 || restrictToCities.some(city => 
      addressText.includes(city.toLowerCase())
    )


    if (!isInAllowedCity) {
      onChange('')
      alert(`Please select an address within: ${restrictToCities.join(', ')}`)
      return
    }

    // Set the full address text, not the place ID
    onChange(fullAddress)
    setShowSuggestions(false)
    setSuggestions([])

    // Get place details using new API first, then fallback to legacy
    try {
      const placeDetails = await getPlaceDetails(placeId)

      console.log('placeDetails', placeDetails)

      // Convert new API format to legacy format for compatibility
      const convertedComponents = placeDetails.addressComponents?.map((component: any) => ({
        long_name: component.longText || component.longName || '',
        short_name: component.shortText || component.shortName || '',
        types: component.types || []
      })) || []


      onPlaceSelect?.({
        address: placeDetails.formattedAddress,
        coordinates: {
          lat: placeDetails.location?.latitude || 0,
          lng: placeDetails.location?.longitude || 0
        },
        components: convertedComponents
      })
    } catch (error) {
      console.error('Places API details error:', error)
      // Fallback to basic address info if details fail
      onPlaceSelect?.({
        address: fullAddress,
        coordinates: { lat: 0, lng: 0 },
        components: []
      })
    }
  }

  const clearInput = () => {
    onChange('')
    setShowSuggestions(false)
    setSuggestions([])
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }
  }

  const handleFocus = () => {
    if (value && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200)
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Loading Places..."
          disabled
          className={className}
        />
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={cn(className, value && 'pr-8')}
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={clearInput}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => {
            // Use the same filtering logic as in the search
            const mainText = suggestion.placePrediction.structuredFormat?.mainText?.text || ''
            const secondaryText = suggestion.placePrediction.structuredFormat?.secondaryText?.text || ''
            const fullText = suggestion.placePrediction.text?.text || ''
            const searchText = `${mainText} ${secondaryText} ${fullText}`.toLowerCase()
            
            const isInAllowedCity = restrictToCities.length === 0 || restrictToCities.some(city => 
              searchText.includes(city.toLowerCase())
            )

            return (
              <div
                key={suggestion.placePrediction.placeId || index}
                className={cn(
                  "w-full px-3 py-2 hover:bg-muted/50 flex items-start gap-2 text-sm cursor-pointer",
                  !isInAllowedCity && "opacity-50 cursor-not-allowed"
                )}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (isInAllowedCity) {
                    handleSelect(suggestion)
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                }}
              >
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">
                    {suggestion.placePrediction.structuredFormat.mainText.text}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {suggestion.placePrediction.structuredFormat.secondaryText.text}
                  </div>
                  {!isInAllowedCity && (
                    <div className="text-destructive text-xs mt-1">
                      Not in allowed cities: {restrictToCities.join(', ')}
                    </div>
                  )}
                </div>
                {isInAllowedCity && (
                  <Check className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            )
          })}
        </div>
      )}

      {isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Searching places...
          </div>
        </div>
      )}

      {restrictToCities.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          Only addresses in {restrictToCities.join(', ')} are allowed
        </p>
      )}
    </div>
  )
}
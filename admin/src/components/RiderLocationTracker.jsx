import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, InfoWindow, google } from '@react-google-maps/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, User, Phone } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

const center = {
  lat: 12.9716,
  lng: 77.5946
};

const RiderLocationTracker = ({ 
  riderId, 
  riderName,
  phoneNumber,
  serviceId,
  customerAddress,
  startTime 
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [directions, setDirections] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [map, setMap] = useState(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);


  // Function to calculate route
  // Function to calculate route - moved inside LoadScript callback
  const calculateRoute = useCallback((origin, destination) => {
    if (!isGoogleLoaded) return;
    
    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Error calculating route:', status);
        }
      }
    );
  }, [isGoogleLoaded]);

  // Fetch initial location and setup tracking
  useEffect(() => {
    const fetchInitialLocation = async () => {
      try {
        // Simulated initial location
        const riderLocation = {
          lat: 12.9716,
          lng: 77.5946,
          timestamp: new Date().toISOString(),
          speed: 20,
          accuracy: 10,
        };
        
        setCurrentLocation(riderLocation);
        
        // Simulate customer location (this should come from your backend)
        const customerLocation = {
          lat: 12.9820,
          lng: 77.6050,
        };
        
        // Only calculate route if Google Maps is loaded
        if (isGoogleLoaded) {
          calculateRoute(
            { lat: riderLocation.lat, lng: riderLocation.lng },
            { lat: customerLocation.lat, lng: customerLocation.lng }
          );
        }
        
        setLocationHistory([
          {
            lat: 12.9716,
            lng: 77.5946,
            timestamp: new Date().toISOString(),
            status: 'Started journey',
          },
          {
            lat: 12.9720,
            lng: 77.5950,
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            status: 'En route to customer',
          },
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching location:', error);
        setIsLoading(false);
      }
    };

    fetchInitialLocation();
  }, [riderId, serviceId, calculateRoute, isGoogleLoaded]);

  // Update elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - start) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  return (
    <div className="space-y-4 p-2 sm:p-4">
      {/* Service Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm text-gray-500">Rider</div>
                <div className="font-medium truncate">{riderName}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm text-gray-500">Contact</div>
                <div className="font-medium truncate">{phoneNumber}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">Elapsed Time</div>
                <div className="font-medium">{formatElapsedTime(elapsedTime)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-4">
            <Button variant="outline" className="w-full gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call Rider</span>
              <span className="sm:hidden">Call</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map View */}
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
          <div className="aspect-[4/3] sm:aspect-video bg-gray-100 rounded-lg">
              <LoadScript 
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                onLoad={() => setIsGoogleLoaded(true)}
              >
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={currentLocation || center}
                  zoom={14}
                  onLoad={onMapLoad}
                >
                  {currentLocation && (
                    <Marker
                      position={currentLocation}
                      icon={{
                        url: '/rider-marker.png',
                        scaledSize: isGoogleLoaded ? new google.maps.Size(40, 40) : null
                      }}
                      onClick={() => setSelectedMarker(currentLocation)}
                    />
                  )}
                  
                  {selectedMarker && (
                    <InfoWindow
                      position={selectedMarker}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-2">
                        <p className="font-medium">{riderName}</p>
                        <p className="text-sm text-gray-600">Speed: {currentLocation.speed} km/h</p>
                      </div>
                    </InfoWindow>
                  )}

                  {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
              </LoadScript>
            </div>
            {currentLocation && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <div className="text-sm text-gray-500">Current Location</div>
                  <div className="font-medium truncate">
                    {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Speed</div>
                  <div className="font-medium">{currentLocation.speed} km/h</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Updates */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] lg:h-[400px]">
              <div className="space-y-4 pr-4">
                {locationHistory.map((location, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{location.status}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(location.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Service Details */}
      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Address</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="truncate max-w-[200px] sm:max-w-none">
                      {customerAddress}
                    </div>
                  </TableCell>
                  <TableCell>
                    {directions?.routes[0]?.legs[0]?.distance?.text || '2.5 km'}
                  </TableCell>
                  <TableCell>
                    {directions?.routes[0]?.legs[0]?.duration?.text || '15 mins'}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Navigation className="h-4 w-4" />
                      <span className="hidden sm:inline">Navigate</span>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiderLocationTracker;
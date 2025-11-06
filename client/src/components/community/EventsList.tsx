import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MapPin, ExternalLink, DollarSign, X, Users } from "lucide-react";
import { format } from "date-fns";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: number;
  userId: number;
  name: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  city?: string;
  organizerName: string;
  description: string;
  externalLink?: string;
  cost?: string;
  createdAt: Date;
  user: {
    name: string;
    lastname: string;
  };
}

const EVENT_TYPES = [
  "Dive Trip",
  "Beach Clean up",
  "Talk / Lecture",
  "Film Festival/ Film Night",
  "Workshop",
  "Other"
];

export function EventsList() {
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  // Form state for new event
  const [newEvent, setNewEvent] = useState({
    name: "",
    type: "",
    startDate: "",
    location: "",
    city: "",
    organizerName: "",
    description: "",
    externalLink: "",
    cost: "",
  });

  // Fetch events
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events', {
      location: locationFilter,
      date: dateFilter === 'all' ? '' : dateFilter,
      type: typeFilter === 'all' ? '' : typeFilter
    }],
    select: (data: any) => data?.events || [],
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (data: typeof newEvent) => {
      return await apiRequest('/api/events', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          startDate: new Date(data.startDate).toISOString(),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      setIsAddDialogOpen(false);
      setNewEvent({
        name: "",
        type: "",
        startDate: "",
        location: "",
        city: "",
        organizerName: "",
        description: "",
        externalLink: "",
        cost: "",
      });
      toast({ title: "Event created!", description: "Your event has been added to the community calendar." });
    },
  });

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.type || !newEvent.startDate || !newEvent.location || !newEvent.organizerName || !newEvent.description) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    createEventMutation.mutate(newEvent);
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading events...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#0A4D68]">Ocean & Dive Events</CardTitle>
                <p className="text-gray-600 mt-1">
                  Discover and join community dives, conservation efforts, and educational events
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#088395] hover:bg-[#0A4D68]" data-testid="button-add-event">
                    + Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="event-name">Event Name *</Label>
                      <Input
                        id="event-name"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                        placeholder="e.g., Beach Cleanup - Coogee Jetty"
                        data-testid="input-event-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="event-type">Event Type *</Label>
                      <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                        <SelectTrigger id="event-type" data-testid="select-event-type">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {EVENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="event-date">Start Date & Time *</Label>
                      <Input
                        id="event-date"
                        type="datetime-local"
                        value={newEvent.startDate}
                        onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                        data-testid="input-event-date"
                      />
                    </div>

                    <div>
                      <Label htmlFor="event-location">Location *</Label>
                      <Input
                        id="event-location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        placeholder="e.g., Coogee Beach, WA"
                        data-testid="input-event-location"
                      />
                    </div>

                    <div>
                      <Label htmlFor="event-city">City/Region</Label>
                      <Input
                        id="event-city"
                        value={newEvent.city}
                        onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
                        placeholder="e.g., Perth"
                        data-testid="input-event-city"
                      />
                    </div>

                    <div>
                      <Label htmlFor="event-organizer">Organizer Name *</Label>
                      <Input
                        id="event-organizer"
                        value={newEvent.organizerName}
                        onChange={(e) => setNewEvent({ ...newEvent, organizerName: e.target.value })}
                        placeholder="e.g., Perth Scuba Club"
                        data-testid="input-event-organizer"
                      />
                    </div>

                    <div>
                      <Label htmlFor="event-description">Description *</Label>
                      <Textarea
                        id="event-description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="What, who, skill level, gear needed..."
                        className="min-h-[100px]"
                        data-testid="input-event-description"
                      />
                    </div>

                    <div>
                      <Label htmlFor="event-link">External Link (optional)</Label>
                      <Input
                        id="event-link"
                        type="url"
                        value={newEvent.externalLink}
                        onChange={(e) => setNewEvent({ ...newEvent, externalLink: e.target.value })}
                        placeholder="https://..."
                        data-testid="input-event-link"
                      />
                    </div>

                    <div>
                      <Label htmlFor="event-cost">Cost</Label>
                      <Input
                        id="event-cost"
                        value={newEvent.cost}
                        onChange={(e) => setNewEvent({ ...newEvent, cost: e.target.value })}
                        placeholder="Free or $20, etc."
                        data-testid="input-event-cost"
                      />
                    </div>

                    <Button 
                      className="w-full bg-[#088395] hover:bg-[#0A4D68]"
                      onClick={handleCreateEvent}
                      disabled={createEventMutation.isPending}
                      data-testid="button-submit-event"
                    >
                      {createEventMutation.isPending ? "Creating..." : "Create Event"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40" data-testid="select-date-filter">
              <SelectValue placeholder="All dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48" data-testid="select-type-filter">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {EVENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-64"
            data-testid="input-location-filter"
          />
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No events found. Be the first to create one!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card 
                key={event.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => setSelectedEvent(event)}
                data-testid={`card-event-${event.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      event.type === 'Beach Clean up' ? 'bg-green-500' :
                      event.type === 'Dive Trip' ? 'bg-blue-500' :
                      event.type === 'Workshop' ? 'bg-purple-500' :
                      'bg-[#088395]'
                    } text-white`}>
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-[#0A4D68] text-lg">{event.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-[#088395]" />
                          {format(new Date(event.startDate), 'PPp')}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-[#088395]" />
                          {event.location}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Organizer:</span> {event.organizerName}
                        </div>
                        {event.cost && (
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-1 text-[#088395]" />
                            {event.cost}
                          </div>
                        )}
                      </div>
                      
                      {event.externalLink && (
                        <Button 
                          size="sm" 
                          className="mt-4 bg-[#088395] hover:bg-[#0A4D68]"
                          onClick={() => window.open(event.externalLink, '_blank')}
                          data-testid={`button-event-link-${event.id}`}
                        >
                          More Info <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Event Detail Dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-8">
                  <DialogTitle className="text-2xl text-[#0A4D68] mb-2">{selectedEvent.name}</DialogTitle>
                  <Badge variant="outline" className="text-sm">
                    {selectedEvent.type}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Event Icon */}
              <div className="flex justify-center">
                <div className={`p-6 rounded-full ${
                  selectedEvent.type === 'Beach Clean up' ? 'bg-green-500' :
                  selectedEvent.type === 'Dive Trip' ? 'bg-blue-500' :
                  selectedEvent.type === 'Workshop' ? 'bg-purple-500' :
                  'bg-[#088395]'
                } text-white`}>
                  <Calendar className="w-12 h-12" />
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[#0A4D68] mb-2">Description</h3>
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-[#0A4D68] mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Date & Time
                    </h3>
                    <p className="text-gray-700">{format(new Date(selectedEvent.startDate), 'PPp')}</p>
                    {selectedEvent.endDate && (
                      <p className="text-gray-600 text-sm mt-1">
                        Ends: {format(new Date(selectedEvent.endDate), 'PPp')}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0A4D68] mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location
                    </h3>
                    <p className="text-gray-700">{selectedEvent.location}</p>
                    {selectedEvent.city && (
                      <p className="text-gray-600 text-sm">{selectedEvent.city}</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0A4D68] mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Organizer
                    </h3>
                    <p className="text-gray-700">{selectedEvent.organizerName}</p>
                  </div>

                  {selectedEvent.cost && (
                    <div>
                      <h3 className="font-semibold text-[#0A4D68] mb-2 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Cost
                      </h3>
                      <p className="text-gray-700">{selectedEvent.cost}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedEvent.externalLink && (
                  <Button 
                    className="flex-1 bg-[#088395] hover:bg-[#0A4D68]"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(selectedEvent.externalLink, '_blank');
                    }}
                    data-testid="button-event-external-link"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    More Information
                  </Button>
                )}
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(window.location.href);
                    toast({ title: "Link copied!", description: "Event link copied to clipboard." });
                  }}
                  data-testid="button-share-event"
                >
                  Share Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

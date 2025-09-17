import { EventDetail } from "@/types/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserMinus } from "lucide-react";

interface ParticipantsListProps {
  event: EventDetail;
  onCancelInscription: (phone: string) => void;
}

export function ParticipantsList({
  event,
  onCancelInscription,
}: ParticipantsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Participantes ({event.inscriptions.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {event.inscriptions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhum participante inscrito ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {event.inscriptions.map((inscription) => (
              <div
                key={inscription.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {inscription.name}
                  </p>
                  <p className="text-sm text-gray-600">{inscription.phone}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancelInscription(inscription.phone)}
                  className="text-red-600 hover:text-red-700"
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

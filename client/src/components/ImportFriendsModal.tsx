import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ImportFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ParsedContact = {
  email?: string;
  firstName?: string;
  lastName?: string;
};

export default function ImportFriendsModal({ isOpen, onClose }: ImportFriendsModalProps) {
  const [activeTab, setActiveTab] = useState<'instagram' | 'csv'>('instagram');
  const [instagramUsernames, setInstagramUsernames] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleClose = () => {
    setActiveTab('instagram');
    setInstagramUsernames('');
    setIsSubmitting(false);
    onClose();
  };

  const parseCsvText = (text: string): ParsedContact[] => {
    const rows = text.split(/\r?\n/).map(r => r.trim()).filter(Boolean);
    if (rows.length === 0) return [];
    const header = rows[0].split(',').map(h => h.trim().toLowerCase());

    const emailIdx = header.findIndex(h => h === 'email');
    const firstNameIdx = header.findIndex(h => h === 'firstname' || h === 'first_name' || h === 'first');
    const lastNameIdx = header.findIndex(h => h === 'lastname' || h === 'last_name' || h === 'last');

    const contacts: ParsedContact[] = [];
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].split(',').map(c => c.trim());
      const contact: ParsedContact = {};
      if (emailIdx >= 0 && cols[emailIdx]) contact.email = cols[emailIdx];
      if (firstNameIdx >= 0 && cols[firstNameIdx]) contact.firstName = cols[firstNameIdx];
      if (lastNameIdx >= 0 && cols[lastNameIdx]) contact.lastName = cols[lastNameIdx];
      if (contact.email || contact.firstName || contact.lastName) {
        contacts.push(contact);
      }
    }
    return contacts;
  };

  const handleCsvFile = async (file: File) => {
    const text = await file.text();
    const contacts = parseCsvText(text);
    await submitContacts(contacts);
  };

  const submitContacts = async (contacts: ParsedContact[]) => {
    if (!contacts || contacts.length === 0) {
      toast({ title: 'No contacts', description: 'Could not find any contacts in your input.', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiRequest('POST', '/api/connections/import', { contacts });
      const result = await res.json();
      toast({
        title: 'Import complete',
        description: `Connected with ${result.connectedCount} users${result.skippedCount ? `, skipped ${result.skippedCount}` : ''}.`,
      });
      handleClose();
    } catch (err: any) {
      toast({ title: 'Import failed', description: err.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstagramSubmit = async () => {
    // For now we accept a comma/space separated list of usernames and treat them as names without email
    const usernames = instagramUsernames
      .split(/[,\n\s]+/)
      .map(u => u.trim())
      .filter(Boolean);

    const contacts: ParsedContact[] = usernames.map(username => {
      // Try to split into first/last if user provided something like First_Last
      const cleaned = username.replace(/^@/, '').replace(/\./g, ' ').replace(/_/g, ' ').trim();
      const parts = cleaned.split(/\s+/);
      if (parts.length >= 2) {
        return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
      }
      return { firstName: cleaned };
    });

    await submitContacts(contacts);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Import friends</DialogTitle>
        </DialogHeader>

        <div className="flex space-x-2 mb-4">
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium ${activeTab === 'instagram' ? 'bg-white text-indigo-600 shadow-sm' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab('instagram')}
          >
            Instagram
          </button>
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium ${activeTab === 'csv' ? 'bg-white text-indigo-600 shadow-sm' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab('csv')}
          >
            CSV Upload
          </button>
        </div>

        {activeTab === 'instagram' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Due to Instagram API limitations, connect friends by pasting their Instagram usernames. We'll try to match existing users by name.
            </p>
            <div>
              <Label htmlFor="ig-usernames" className="block text-sm font-medium text-gray-700 mb-2">
                Instagram usernames (comma, space, or newline separated)
              </Label>
              <textarea
                id="ig-usernames"
                className="w-full border border-gray-300 rounded-md p-2 h-28"
                placeholder="@alex_johnson, @jane.doe, @michael"
                value={instagramUsernames}
                onChange={(e) => setInstagramUsernames(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button className="gradient-bg text-white" disabled={isSubmitting || instagramUsernames.trim().length === 0} onClick={handleInstagramSubmit}>
                {isSubmitting ? 'Importing…' : 'Import'}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'csv' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload a CSV with headers like: <code>email,firstName,lastName</code>.
            </p>
            <div>
              <Label htmlFor="csv-file" className="block text-sm font-medium text-gray-700 mb-2">
                Choose CSV file
              </Label>
              <Input id="csv-file" type="file" accept=".csv,text/csv" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                await handleCsvFile(file);
              }} />
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={handleClose}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
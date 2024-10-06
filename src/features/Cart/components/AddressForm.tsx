import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const AddressForm = ({
  title,
  prefix,
}: {
  title: string;
  prefix: string;
}) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 text-left">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${prefix}FirstName`}>First Name</Label>
          <Input id={`${prefix}FirstName`} placeholder="John" />
        </div>
        <div>
          <Label htmlFor={`${prefix}LastName`}>Last Name</Label>
          <Input id={`${prefix}LastName`} placeholder="Doe" />
        </div>
      </div>
      <div>
        <Label htmlFor={`${prefix}Address`}>Address</Label>
        <Input id={`${prefix}Address`} placeholder="123 Main St" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${prefix}ZipCode`}>ZIP Code</Label>
          <Input id={`${prefix}ZipCode`} placeholder="12345" />
        </div>
        <div>
          <Label htmlFor={`${prefix}Country`}>Country</Label>
          <Select>
            <SelectTrigger id={`${prefix}Country`}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sg">Singapore</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardContent>
  </Card>
);

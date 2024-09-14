import PersonOutlinedIcon from '@/assets/person.svg';
import { ArrowLeft } from 'lucide-react';

export const FormHeader: React.FC<{ title: string; onClose: () => void }> = ({
  title,
  onClose,
}) => (
  <header className="w-full flex items-center justify-between mb-6 relative">
    <ArrowLeft onClick={onClose} className="cursor-pointer absolute left-0" />
    <div className="flex items-center justify-center w-full">
      <PersonOutlinedIcon />
      <h1 className="ml-2 text-lg font-semibold">{title}</h1>
    </div>
  </header>
);

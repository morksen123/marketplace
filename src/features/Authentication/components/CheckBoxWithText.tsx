import { Checkbox } from '@/components/ui/checkbox';

type CheckBoxWithTextProps = {
  text: string;
};

export function CheckboxWithText({ text }: CheckBoxWithTextProps) {
  return (
    <div className="flex items-end space-x-2">
      <Checkbox
        id="rememberMe"
        className="border-black data-[state=checked]:text-white data-[state=checked]:bg-black"
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="rememberMe"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {text}
        </label>
      </div>
    </div>
  );
}

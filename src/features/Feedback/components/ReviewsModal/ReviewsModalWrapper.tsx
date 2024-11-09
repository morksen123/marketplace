interface ReviewsModalWrapperProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewsModalWrapper = ({
  children,
  isOpen,
  onClose,
}: ReviewsModalWrapperProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute inset-y-0 right-0 w-full max-w-2xl bg-white 
    shadow-xl transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}
      >
        {children}
      </div>
    </div>
  );
};

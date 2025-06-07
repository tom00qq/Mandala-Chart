interface MaskProps {
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

const Mask: React.FC<MaskProps> = ({ position }) => {
  return (
    <div
      className="fixed inset-0 bg-black opacity-60 z-10"
      style={{
        top: position?.top ?? undefined,
        left: position?.left ?? undefined,
        right: position?.right ?? undefined,
        bottom: position?.bottom ?? undefined,
      }}
    />
  );
};

export default Mask;

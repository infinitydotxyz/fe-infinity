import transferImage from 'src/images/transfer.svg';

export function TransferIcon() {
  return (
    <div className="border w-12 h-12 flex justify-center items-center rounded-full">
      <img src={transferImage.src} alt="Transfer" />
    </div>
  );
}

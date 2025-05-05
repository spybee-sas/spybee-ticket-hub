
import { TicketAttachment } from "@/types/ticket";

interface TicketAttachmentsProps {
  attachments: TicketAttachment[];
}

const TicketAttachments = ({ attachments }: TicketAttachmentsProps) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Attachments</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="border rounded-md overflow-hidden">
            <img
              src={attachment.file_url}
              alt={attachment.file_name}
              className="w-full h-40 object-cover"
            />
            <div className="p-2 text-sm">
              <p className="truncate">{attachment.file_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketAttachments;

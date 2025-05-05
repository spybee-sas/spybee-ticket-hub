
import { TicketAttachment } from "@/types/ticket";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface TicketAttachmentsProps {
  attachments: TicketAttachment[];
}

const TicketAttachments = ({ attachments }: TicketAttachmentsProps) => {
  const { t } = useLanguage();
  
  if (attachments.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">{t('ticketDetails.attachments')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attachments.map((attachment) => (
          <div 
            key={attachment.id} 
            className="border border-gray-200 rounded-md p-3 flex justify-between items-center"
          >
            <div className="truncate flex-1">
              <span className="font-medium">{attachment.file_name}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => window.open(attachment.file_url, '_blank')}
            >
              {t('ticketDetails.view')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketAttachments;

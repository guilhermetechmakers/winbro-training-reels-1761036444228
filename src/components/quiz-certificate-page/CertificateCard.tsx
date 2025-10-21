import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Award, Download, Share2, ExternalLink, Calendar, Shield, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CertificateCardProps } from '@/types/quiz-certificate';

export default function CertificateCard({ 
  certificateInfo, 
  onDownload, 
  onShare, 
  onVerify, 
  className 
}: CertificateCardProps) {
  const { certificate, verification_url, download_url, share_url, issued_at, expires_at, status } = certificateInfo;

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download behavior
      window.open(download_url, '_blank');
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator.share({
          title: certificate.title,
          text: `I earned a certificate: ${certificate.title}`,
          url: share_url
        });
      } else {
        // Fallback to copying URL
        navigator.clipboard.writeText(share_url);
      }
    }
  };

  const handleVerify = () => {
    if (onVerify) {
      onVerify();
    } else {
      // Default verify behavior
      window.open(verification_url, '_blank');
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-winbro-amber" />
          Certificate of Completion
        </CardTitle>
        <CardDescription>
          Your achievement has been recorded and verified
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Certificate Header */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate">
                {certificate.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Certificate #{certificate.certificate_number}
              </p>
              <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Issued {new Date(issued_at).toLocaleDateString()}
                </div>
                {expires_at && (
                  <div className="flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    Expires {new Date(expires_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "ml-4",
                status === 'issued' 
                  ? "bg-winbro-success/10 text-winbro-success border-winbro-success/20"
                  : status === 'expired'
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "bg-muted/10 text-muted-foreground border-muted/20"
              )}
            >
              {status.toUpperCase()}
            </Badge>
          </div>

          {/* Certificate Description */}
          {certificate.description && (
            <p className="text-sm text-muted-foreground">
              {certificate.description}
            </p>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button 
              onClick={handleDownload} 
              className="flex-1 min-w-0"
              disabled={status !== 'issued'}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShare} 
              className="flex-1 min-w-0"
              disabled={status !== 'issued'}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              onClick={handleVerify} 
              className="flex-1 min-w-0"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Verify
            </Button>
          </div>

          {/* QR Code Section */}
          {certificateInfo.qr_code_data && (
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-white rounded border flex items-center justify-center">
                  <img 
                    src={certificateInfo.qr_code_data} 
                    alt="Certificate QR Code" 
                    className="w-12 h-12"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Verification QR Code</p>
                  <p className="text-xs text-muted-foreground">
                    Scan to verify this certificate
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Verification URL */}
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-1">Verification URL:</p>
            <div className="flex items-center space-x-2">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                {verification_url}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(verification_url)}
                className="px-2"
              >
                <QrCode className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// IMPROVEMENT: [FRONTEND_IMPROVEMENTS_SPEC] - Enhanced screenshot gallery with error handling
// Date: 2025-10-30
// Related to: Section 1.1 - Image loading states and Section 1.3 - Pagination

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Screenshot } from '@/types';
import { formatDate } from '@/utils/formatters';
import { ChevronLeft, ChevronRight, ImageOff, AlertTriangle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ScreenshotsGalleryProps {
  screenshots: Screenshot[];
}

export default function ScreenshotsGallery({ screenshots }: ScreenshotsGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imageStates, setImageStates] = useState<Record<string, 'loading' | 'success' | 'error'>>({});

  const handleImageLoad = (screenshotId: string) => {
    setImageStates(prev => ({ ...prev, [screenshotId]: 'success' }));
  };

  const handleImageError = (screenshotId: string) => {
    setImageStates(prev => ({ ...prev, [screenshotId]: 'error' }));
    console.error(`[ScreenshotsGallery] Failed to load screenshot: ${screenshotId}`);
  };

  const getScreenshotUrl = (screenshotId: string) => `/api/screenshot/${screenshotId}`;

  const openLightbox = (index: number) => {
    // Only open lightbox if image loaded successfully
    const screenshot = screenshots[index];
    if (imageStates[screenshot.screenshot_id] === 'success') {
      setSelectedIndex(index);
    }
  };

  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < screenshots.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const currentScreenshot = selectedIndex !== null ? screenshots[selectedIndex] : null;

  // Calculate statistics
  const errorCount = Object.values(imageStates).filter(state => state === 'error').length;
  const totalLoaded = Object.keys(imageStates).length;
  const unavailablePercentage = totalLoaded > 0 ? (errorCount / totalLoaded) * 100 : 0;

  // Empty state
  if (screenshots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Скриншоты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <ImageOff className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">Скриншоты отсутствуют</h3>
            <p className="text-muted-foreground text-center mt-2">
              На выбранную дату нет записанных скриншотов.
              <br />
              Проверьте настройки агента или выберите другую дату.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // All screenshots unavailable
  if (totalLoaded === screenshots.length && errorCount === screenshots.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Скриншоты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="w-16 h-16 text-orange-400 mb-4" />
            <h3 className="text-lg font-medium text-foreground">Скриншоты недоступны</h3>
            <p className="text-muted-foreground text-center mt-2">
              Файлы изображений отсутствуют в хранилище.
              <br />
              Возможно, они были удалены по истечении срока хранения.
            </p>
            <Link to="/maintenance">
              <Button variant="outline" className="mt-4">
                Перейти к обслуживанию данных
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Скриншоты <span className="text-muted-foreground">({screenshots.length})</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Скриншоты хранятся 180 дней. После этого автоматически удаляются.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Warning if >20% screenshots unavailable */}
          {unavailablePercentage > 20 && errorCount > 0 && (
            <Alert variant="default" className="mb-4 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-900">Внимание</AlertTitle>
              <AlertDescription className="text-orange-800">
                Часть скриншотов ({errorCount} из {screenshots.length}) недоступна. 
                Возможно, файлы были удалены из хранилища. 
                <Link to="/maintenance" className="underline ml-1 font-medium">
                  Выполнить проверку целостности данных
                </Link>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {screenshots.map((screenshot, index) => {
              const imageUrl = getScreenshotUrl(screenshot.screenshot_id);
              const state = imageStates[screenshot.screenshot_id] || 'loading';

              return (
                <div
                  key={screenshot.screenshot_id}
                  className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
                    state === 'success' ? 'cursor-pointer hover:ring-2 hover:ring-primary' : ''
                  }`}
                  onClick={() => openLightbox(index)}
                >
                  {state === 'error' ? (
                    // Error state - image unavailable
                    <div className="flex flex-col items-center justify-center h-full bg-red-50 border-2 border-red-200 rounded">
                      <ImageOff className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Изображение недоступно</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(screenshot.timestamp, 'HH:mm:ss')}</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-gray-400 mt-2 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Файл удалён или недоступен в хранилище</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : state === 'loading' ? (
                    // Loading state
                    <Skeleton className="w-full h-full" />
                  ) : (
                    // Success state
                    <>
                      <img
                        src={imageUrl}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onLoad={() => handleImageLoad(screenshot.screenshot_id)}
                        onError={() => handleImageError(screenshot.screenshot_id)}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                        <div>{formatDate(screenshot.timestamp, 'HH:mm:ss')}</div>
                        <div className="text-[10px] opacity-75 truncate">{screenshot.window_title}</div>
                      </div>
                    </>
                  )}
                  
                  {/* Hidden img for loading detection */}
                  {state === 'loading' && (
                    <img
                      src={imageUrl}
                      alt=""
                      className="hidden"
                      onLoad={() => handleImageLoad(screenshot.screenshot_id)}
                      onError={() => handleImageError(screenshot.screenshot_id)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lightbox Modal */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-6xl h-[90vh] p-0">
          <DialogTitle className="sr-only">
            Скриншот {(selectedIndex ?? 0) + 1} из {screenshots.length}
          </DialogTitle>
          {currentScreenshot && (
            <div className="relative w-full h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center bg-black p-4">
                <img
                  src={getScreenshotUrl(currentScreenshot.screenshot_id)}
                  alt="Screenshot"
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="bg-background p-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      Скриншот {(selectedIndex ?? 0) + 1} из {screenshots.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(currentScreenshot.timestamp)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-md">
                      {currentScreenshot.window_title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToPrevious}
                      disabled={selectedIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToNext}
                      disabled={selectedIndex === screenshots.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

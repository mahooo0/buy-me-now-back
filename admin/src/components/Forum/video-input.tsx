'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { X, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoInputProps {
    name: string;
    title: string;
    multiple?: boolean;
    onChange: (files: File[] | null) => void;
    value?: File[] | string | string[] | null;
}

export function VideoInput({
    name,
    multiple,
    onChange,
    value,
}: VideoInputProps) {
    const [videos, setVideos] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [playing, setPlaying] = useState<{ [key: number]: boolean }>({});
    const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({});

    useEffect(() => {
        // Convert string or array of strings to previews
        if (typeof value === 'string') {
            setPreviews([value]);
        } else if (Array.isArray(value)) {
            setPreviews(
                value.map((file) =>
                    file instanceof File ? URL.createObjectURL(file) : file
                )
            );
        } else {
            setPreviews([]);
        }
    }, [value]);

    useEffect(() => {
        // Cleanup old previews
        return () => {
            previews.forEach((preview) => {
                if (preview.startsWith('blob:')) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [previews]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []).filter((file) =>
            file.type.startsWith('video/')
        );

        setVideos(selectedFiles);

        // Cleanup old previews
        previews.forEach((preview) => {
            if (preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        });

        // Create new previews
        const newPreviews = selectedFiles.map((file) =>
            URL.createObjectURL(file)
        );
        setPreviews(newPreviews);
        onChange(selectedFiles);
    };

    const removeVideo = (index: number) => {
        const newVideos = videos.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);

        // Cleanup removed preview
        if (previews[index]?.startsWith('blob:')) {
            URL.revokeObjectURL(previews[index]);
        }

        setVideos(newVideos);
        setPreviews(newPreviews);
        onChange(newVideos.length ? newVideos : null);
    };

    const togglePlay = (index: number) => {
        const video = videoRefs.current[index];
        if (!video) return;

        if (video.paused) {
            video.play();
            setPlaying((prev) => ({ ...prev, [index]: true }));
        } else {
            video.pause();
            setPlaying((prev) => ({ ...prev, [index]: false }));
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <Input
                    id={name}
                    name={name}
                    type="file"
                    multiple={multiple}
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    accept="video/*"
                />
            </div>

            {previews.length > 0 && (
                <div className="grid gap-4">
                    {previews.map((src, index) => (
                        <div
                            key={`${src}-${index}`}
                            className="flex flex-col gap-4 p-4 rounded-lg border bg-muted/40"
                        >
                            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-background">
                                <video
                                    ref={(el) => {
                                        if (el) videoRefs.current[index] = el;
                                    }}
                                    src={src}
                                    className="h-full w-full"
                                    onLoadedMetadata={(e) => {
                                        const video = e.currentTarget;
                                        video.volume = 0.5;
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className={cn(
                                        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                                        'bg-background/80 hover:bg-background/90'
                                    )}
                                    onClick={() => togglePlay(index)}
                                >
                                    {playing[index] ? (
                                        <Pause className="h-4 w-4" />
                                    ) : (
                                        <Play className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {videos[index]?.name ||
                                            `Video ${index + 1}`}
                                    </p>
                                    {videos[index] && (
                                        <p className="text-sm text-muted-foreground">
                                            {formatFileSize(videos[index].size)}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => removeVideo(index)}
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">
                                        Remove video
                                    </span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

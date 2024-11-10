export interface AudioFile {
  id: string;
  title: string;
  description: string;
  url: string;
  metadata: {
    tags: string[];
  };
  createdAt: string;
}
import { useRef, useState } from "react";
import { Camera, Clock3, ImagePlus, PenLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useBuildJournal } from "@/hooks/useBuildJournal";

const BuildJournal = () => {
  const { posts, addPost, removePost } = useBuildJournal();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleImage = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Please choose a photo under 5MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const publishPost = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;
    addPost({ title: title.trim(), description: description.trim(), author: author.trim() || "Maker", image });
    setTitle("");
    setAuthor("");
    setDescription("");
    setImage(null);
    toast({ title: "Build journal post saved", description: "Your project story is now in your showcase." });
  };

  return (
    <section className="max-w-5xl mx-auto pt-20" aria-labelledby="build-journal">
      <div className="border-b border-border/60 pb-4">
        <p className="terminal-label">// maker journal</p>
        <h2 id="build-journal" className="mt-2 text-2xl md:text-3xl font-bold">Show what you made</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Post a photo and a short story. Your build notes stay available on this device.</p>
      </div>

      <form onSubmit={publishPost} className="mt-6 rounded-lg glass p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="journal-title">Project name</Label><Input id="journal-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="My plant monitor" /></div>
          <div className="space-y-2"><Label htmlFor="journal-author">Your name (optional)</Label><Input id="journal-author" value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="A maker name" /></div>
        </div>
        <div className="mt-4 space-y-2"><Label htmlFor="journal-description">What did you make?</Label><Textarea id="journal-description" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What worked, what you learned, and what you would change next time..." /></div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => handleImage(event.target.files?.[0])} />
          <Button type="button" variant="outline" className="gap-2" onClick={() => fileRef.current?.click()}><ImagePlus className="h-4 w-4" />{image ? "Change photo" : "Add project photo"}</Button>
          {image && <img src={image} alt="Selected project preview" className="h-10 w-10 rounded object-cover" />}
          <Button type="submit" className="ml-auto gap-2" disabled={!title.trim() || !description.trim()}><PenLine className="h-4 w-4" />Publish story</Button>
        </div>
      </form>

      {posts.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id} className="overflow-hidden rounded-lg glass">
              {post.image ? <img src={post.image} alt={`${post.title} by ${post.author}`} loading="lazy" className="aspect-[4/3] w-full object-cover" /> : <div className="flex aspect-[4/3] items-center justify-center bg-primary/5"><Camera className="h-8 w-8 text-primary/60" /></div>}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2"><h3 className="font-display font-semibold">{post.title}</h3><Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removePost(post.id)} aria-label={`Delete ${post.title}`}><Trash2 className="h-4 w-4" /></Button></div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-4">{post.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><span>{post.author}</span><span aria-hidden="true">·</span><Clock3 className="h-3.5 w-3.5" /><time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</time></div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BuildJournal;
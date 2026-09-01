import { Scene } from "@/components/shared/Scene";
import { APP_NAME } from "@/constants";
import { FaRocket } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-background">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to&nbsp;
          <code className="font-bold">{APP_NAME}</code>
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center gap-8">
        <h1 className="text-5xl font-bold tracking-tight">
          Industrial Grade Next.js
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Configured with Tailwind CSS, shadcn/ui, Three.js, React Icons, Zod, and a scalable folder structure.
        </p>
        
        <div className="flex gap-4">
          <Button className="gap-2">
            <FaRocket /> Get Started
          </Button>
          <Button variant="outline">
            Documentation
          </Button>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-12">
        <h2 className="text-2xl font-semibold mb-6">Interactive 3D Scene</h2>
        <Scene />
      </div>
    </main>
  );
}

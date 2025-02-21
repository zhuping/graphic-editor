import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { editor } from '../core';
import { RemoveBackgroundPlugin, AddTextPlugin } from '../plugins';
import EditorComponent from '../components/Editor';
import '../styles/text-plugin.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function registerPlugins() {
  editor.registerPlugin(new RemoveBackgroundPlugin());
  editor.registerPlugin(new AddTextPlugin());
  // 注册其他插件...
}

export default function Home() {
  registerPlugins();

  return (
    <div className="flex justify-center">
      <EditorComponent />
    </div>
  );
}

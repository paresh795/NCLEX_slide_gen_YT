'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { motion } from "framer-motion";
import { Key } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    // Store in localStorage
    localStorage.setItem('openai_api_key', apiKey);
    
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Key className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Settings
            </h1>
          </motion.div>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Configure your OpenAI API key and other settings
          </p>
        </motion.div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">OpenAI API Key</Label>
              <p className="text-sm text-gray-500 mt-1">
                Enter your OpenAI API key to use the NCLEX Slide Generator. 
                Your key is stored locally in your browser and never sent to our servers.
              </p>
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="font-mono"
              />
              <Button 
                onClick={handleSaveKey}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Save API Key
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              <p>Don&apos;t have an API key? Get one from the{' '}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  OpenAI Dashboard
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 
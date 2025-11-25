import { Button } from '@/components/ui/button';
import { CodeXml, Download, Monitor, SquareArrowOutUpRight, TabletSmartphone } from 'lucide-react';
import React from 'react'

function WebPageTools() {
  return (
    <div className="p-3 border shadow rounded-b-xl flex justify-between items-center ">
      <div className="flex items-center justify-center gap-2">
        <Button variant={"outline"}>
          <Monitor />
        </Button>
        <Button variant={"outline"}>
          <TabletSmartphone />
        </Button>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Button variant={"outline"}>
          View
          <SquareArrowOutUpRight />
        </Button>
        <Button>
          Code
          <CodeXml />
        </Button>
        <Button>
          Download
          <Download />
        </Button>
      </div>
    </div>
  );
}

export default WebPageTools

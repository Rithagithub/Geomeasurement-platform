"use client";

import { useEffect, useState } from "react";
import { Background, Controls, MiniMap, ReactFlow } from "reactflow";
import "reactflow/dist/style.css";

import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import knowledgeGraphService from "@/services/knowledgeGraphService";

const nodeStyle = {
  background: "#F8F9F7",
  border: "1px solid rgba(18,21,28,0.1)",
  borderRadius: 10,
  padding: "8px 4px",
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  color: "#12151C",
};

export default function KnowledgeGraphPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    try {
      const data = await knowledgeGraphService.getKnowledgeGraph();

      const flowNodes = data.nodes.map((node, index) => ({
        id: node.id,
        data: {
          label: `${node.label} · ${node.completion}%`,
        },
        position: {
          x: (index % 3) * 250,
          y: Math.floor(index / 3) * 180,
        },
        style: {
          ...nodeStyle,
          borderColor: node.completion === 100 ? "#2F8F7C" : "rgba(18,21,28,0.1)",
        },
      }));

      const flowEdges = data.edges.map((edge, index) => ({
        id: `edge-${index}`,
        source: edge.source,
        target: edge.target,
        style: { stroke: "#2F8F7C", strokeOpacity: 0.5 },
        animated: true,
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Your knowledge, mapped"
        title="Knowledge graph"
        subtitle="Every node is a concept. Every edge is a connection you've made between them."
      />

      <div className="card h-[75vh] w-full overflow-hidden p-0">
        {loading ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <span className="node-dot animate-pulse" />
            <p className="eyebrow text-ink-400">Building your graph…</p>
          </div>
        ) : (
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <MiniMap
              maskColor="rgba(238,240,238,0.6)"
              nodeColor="#2F8F7C"
              style={{ background: "#F8F9F7", border: "1px solid rgba(18,21,28,0.08)" }}
            />
            <Controls />
            <Background color="#12151C" gap={20} />
          </ReactFlow>
        )}
      </div>
    </MainLayout>
  );
}

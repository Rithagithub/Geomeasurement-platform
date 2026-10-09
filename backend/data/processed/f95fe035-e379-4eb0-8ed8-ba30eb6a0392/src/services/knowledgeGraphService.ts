import api from "./api";

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: string;
  completion: number;
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
}

export interface KnowledgeGraphResponse {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

const getKnowledgeGraph = async (): Promise<KnowledgeGraphResponse> => {
  const response = await api.get("/knowledge-graph");
  return response.data;
};

export default {
  getKnowledgeGraph,
};
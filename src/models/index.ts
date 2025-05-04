export interface IGroup {
  name: string;
}

export interface SnippetContent {
  value: string;
}

export interface ISnippet {
  id: string;
  group: string;
  name: string;
  content: SnippetContent[];
}

export interface ISnippetCategory {
  name: string;
  snippets: ISnippet[];
}

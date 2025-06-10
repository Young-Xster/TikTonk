import React from 'react';

type ContextType = {
  background: [string, React.Dispatch<React.SetStateAction<string>>];
  source: [string, React.Dispatch<React.SetStateAction<string>>];
};

export const PostContext = React.createContext<ContextType>({
  background: ["None", () => {}],
  source: ["None", () => {}],
});

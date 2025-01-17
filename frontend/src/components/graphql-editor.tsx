'use client'
import React from "react";
import dynamic from 'next/dynamic';

const Playground = dynamic<any>(
    async () => {
      const [{ store, Playground }, { Provider }] = await Promise.all([
        import('graphql-playground-react'),
        import('react-redux'),
      ])
      return ({ ...args }) => {
        return <Provider store={store}>
          <Playground {...args} />
        </Provider>
      }
    },
    { ssr: false },
)

function GraphqlEditor() {
  return (
    // <Playground endpoint="http://localhost:8000/api/v1/db/graphql" />
    <iframe 
    src="http://localhost:8000/api/v1/db/graphql" 
    width="100%" 
    height="500px" 
    frameBorder="0" 
    allowFullScreen
  />
  );
}

export default GraphqlEditor;

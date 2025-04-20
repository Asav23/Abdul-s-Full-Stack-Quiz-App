import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/collections')
      .then(res => res.json())
      .then(data => setCollections(data))
      .catch(err => console.error('Error loading collections:', err));
  }, []);

  const handleAddCollection = () => {
    if (!name.trim()) return alert('Enter a collection name');

    fetch('http://localhost:8000/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
      .then(res => res.json())
      .then(newCollection => {
        setCollections(prev => [...prev, newCollection]);
        setName('');
      })
      .catch(err => console.error('Failed to create collection:', err));
  };

  const handleView = (id) => {
    navigate(`/view-collection/${id}`);
  };

  return (
    <Container>
      <Title>Collections</Title>
      <Input
        type="text"
        placeholder="New Collection Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <AddButton onClick={handleAddCollection}>Add Collection</AddButton>

      <List>
        {collections.map(c => (
          <Box key={c.id}>
            <h3>{c.name}</h3>
            <ViewButton onClick={() => handleView(c.id)}>View Collection</ViewButton>
          </Box>
        ))}
      </List>
    </Container>
  );
};

export default Collections;

const Container = styled.div`
  padding: 30px;
  max-width: 900px;
  margin: 30px auto;
  background: #002d72;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  color: #fff;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 2px solid #004d98;
  background-color: #001f4d;
  color: #fff;
`;

const AddButton = styled.button`
  background: #004d98;
  color: #fff;
  padding: 12px 24px;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: #003471;
    transform: scale(1.05);
  }
`;

const List = styled.div`
  margin-top: 30px;
`;

const Box = styled.div`
  background: #003e8e;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);

  h3 {
    margin: 0 0 10px;
    color: #a50044;
  }
`;

const ViewButton = styled.button`
  background: #a50044;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 1rem;

  &:hover {
    background: #91003a;
  }
`;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 40px;
  max-width: 1000px;
  margin: auto;
  background: linear-gradient(135deg, #a50044, #004d98);
  min-height: 100vh;
  color: #fff;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1em;
  margin-bottom: 20px;
  width: 100%;
  border-radius: 8px;
  border: none;
  background: #fff;
  color: #000;
`;

const CollectionCard = styled.div`
  background: #002b66;
  border-left: 8px solid #ffcb05;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
`;

const CollectionTitle = styled.h3`
  margin-bottom: 10px;
  color: #ffcb05;
`;

const QuizItem = styled.div`
  background: #004d98;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  background: #ffcb05;
  color: #004d98;
  padding: 8px 16px;
  margin: 10px 10px 0 0;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #e0b904;
  }
`;

const DangerButton = styled(Button)`
  background: #a50044;
  color: #fff;

  &:hover {
    background: #720032;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  color: #333;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const ModalButtons = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const CreateCollection = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [collectionName, setCollectionName] = useState('');
  const [confirm, setConfirm] = useState({ show: false, action: null });
  const [editMode, setEditMode] = useState({});

  useEffect(() => {
    fetchQuizzes();
    fetchCollections();
  }, []);

  const fetchQuizzes = async () => {
    const res = await fetch('http://localhost:8000/api/quizzes');
    const data = await res.json();
    setQuizzes(data);
  };

  const fetchCollections = async () => {
    const res = await fetch('http://localhost:8000/api/collections');
    const data = await res.json();
    setCollections(data);
  };

  const handleCheckboxChange = (quizId) => {
    setSelectedQuizzes((prev) =>
      prev.includes(quizId)
        ? prev.filter((id) => id !== quizId)
        : [...prev, quizId]
    );
  };

  const createCollection = async () => {
    if (!collectionName.trim()) return;
    await fetch('http://localhost:8000/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: collectionName, quizzes: selectedQuizzes }),
    });
    setCollectionName('');
    setSelectedQuizzes([]);
    fetchCollections();
  };

  const deleteCollection = (id) => {
    setConfirm({
      show: true,
      action: async () => {
        await fetch(`http://localhost:8000/api/collections/${id}`, {
          method: 'DELETE',
        });
        fetchCollections();
      },
    });
  };

  const removeQuizFromCollection = (collectionId, quizId) => {
    setConfirm({
      show: true,
      action: async () => {
        const collection = collections.find((col) => col.id === collectionId);
        const updatedQuizzes = collection.quizzes.filter((qId) => qId !== quizId);
        await fetch(`http://localhost:8000/api/collections/${collectionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...collection, quizzes: updatedQuizzes }),
        });
        fetchCollections();
      },
    });
  };

  const addQuizToCollection = async (collectionId, quizId) => {
    const collection = collections.find((col) => col.id === collectionId);
    if (!collection.quizzes.includes(quizId)) {
      const updated = [...collection.quizzes, quizId];
      await fetch(`http://localhost:8000/api/collections/${collectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...collection, quizzes: updated }),
      });
      fetchCollections();
    }
  };

  return (
    <Container>
      <h2 style={{ color: '#ffcb05' }}>Create a New Collection</h2>
      <Input
        type="text"
        placeholder="Collection name"
        value={collectionName}
        onChange={(e) => setCollectionName(e.target.value)}
      />

      <h4>Select Quizzes</h4>
      {quizzes.map((quiz) => (
        <div key={quiz.id}>
          <input
            type="checkbox"
            checked={selectedQuizzes.includes(quiz.id)}
            onChange={() => handleCheckboxChange(quiz.id)}
          />
          {quiz.name}
        </div>
      ))}

      <Button onClick={createCollection}>Create Collection</Button>

      <h2 style={{ color: '#ffcb05', marginTop: '40px' }}>Existing Collections</h2>
      {collections.map((col) => (
        <CollectionCard key={col.id}>
          <CollectionTitle>{col.name}</CollectionTitle>

          <Button onClick={() =>
            setEditMode((prev) => ({ ...prev, [col.id]: !prev[col.id] }))
          }>
            {editMode[col.id] ? 'Close Edit Mode' : 'Edit Collection'}
          </Button>
          <DangerButton onClick={() => deleteCollection(col.id)}>
            Delete Collection
          </DangerButton>

          {editMode[col.id] && (
            <>
              <h4 style={{ color: '#ffcb05' }}>Current Quizzes</h4>
              {col.quizzes.length === 0 && <p>No quizzes yet.</p>}
              {col.quizzes.map((qid) => {
                const quiz = quizzes.find((q) => q.id === qid);
                return quiz ? (
                  <QuizItem key={qid}>
                    {quiz.name}
                    <DangerButton onClick={() => removeQuizFromCollection(col.id, qid)}>
                      Remove
                    </DangerButton>
                  </QuizItem>
                ) : null;
              })}

              <h4 style={{ color: '#ffcb05' }}>Add New Quizzes</h4>
              {quizzes
                .filter((q) => !col.quizzes.includes(q.id))
                .map((quiz) => (
                  <Button
                    key={quiz.id}
                    onClick={() => addQuizToCollection(col.id, quiz.id)}
                  >
                    + {quiz.name}
                  </Button>
                ))}
            </>
          )}
        </CollectionCard>
      ))}

      {confirm.show && (
        <Modal>
          <ModalContent>
            <p>Are you sure you want to proceed?</p>
            <ModalButtons>
              <Button
                onClick={() => {
                  confirm.action();
                  setConfirm({ show: false, action: null });
                }}
              >
                Yes
              </Button>
              <Button onClick={() => setConfirm({ show: false, action: null })}>
                Cancel
              </Button>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default CreateCollection;

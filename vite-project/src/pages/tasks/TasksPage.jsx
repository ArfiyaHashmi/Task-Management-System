import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios'; // Assuming you're using axios for API calls
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Board from '../../components/Board';
import Editable from '../../components/Editable';
import AuthContext from '../../context/authContext';

function TasksPage() {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user, token } = authContext; // Assuming your auth context provides the auth token

  
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });

  // Fetch boards from the backend when component mounts or user changes
  useEffect(() => {
    const fetchBoards = async () => {
      if (!isAuthenticated || !user || !token) {
        setBoards([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Configure headers with auth token
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };
        
        // Fetch boards for the current user
        const response = await axios.get('/api/boards', config);
        setBoards(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching boards:', err);
        // setError('Failed to load your boards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [isAuthenticated, user, token]);

  // Save boards to backend whenever they change
  const saveBoards = async (updatedBoards) => {
    if (!isAuthenticated || !user || !token) return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Send updated boards to backend
      await axios.put('/api/boards', { boards: updatedBoards }, config);
    } catch (err) {
      console.error('Error saving boards:', err);
      setError('Failed to save your changes. Please try again.');
    }
  };

  const addboardHandler = async (name) => {
    try {
        const newBoard = {
            id: `board-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: name,
            cards: [],
        };

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.post('http://localhost:5000/api/boards', 
            { board: newBoard }, 
            config
        );

        if (response.data) {
            setBoards(response.data);
            setError(null);
        }
    } catch (err) {
        console.error('Error adding board:', err);
        setError('Failed to add board. Please try again.');
    }
};

  const removeBoard = async (id) => {
    try {
        if (!window.confirm('Are you sure you want to delete this board?')) {
            return;
        }

        setLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.delete(
            `http://localhost:5000/api/boards/${id}`, 
            config
        );

        if (response.data) {
            setBoards(boards.filter(board => board.id !== id));
            setError(null);
        }

    } catch (err) {
        console.error('Error removing board:', err);
        setError(err.response?.data?.message || 'Failed to remove board. Please try again.');
    } finally {
        setLoading(false);
    }
  };

 
  const addCardHandler = async (id, title) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    const newCard = {
      id: Date.now() + Math.random() * 2,
      title,
      labels: [],
      date: "",
      tasks: [],
    };
    
    tempBoards[index].cards.push(newCard);
    setBoards(tempBoards);
    
    try {
      // Add card to board in backend
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      await axios.post(`/api/boards/${id}/cards`, { card: newCard }, config);
    } catch (err) {
      console.error('Error adding card:', err);
      // setError('Failed to add card. Please try again.');
    }
  };

  const removeCard = async (bid, cid) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);
    setBoards(tempBoards);
    
    try {
      // Remove card from backend
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      await axios.delete(`/api/boards/${bid}/cards/${cid}`, config);
    } catch (err) {
      console.error('Error removing card:', err);
      // setError('Failed to remove card. Please try again.');
    }
  };

  const dragEnded = async (bid, cid) => {
    const s_boardIndex = boards.findIndex((item) => item.id === bid);
    if (s_boardIndex < 0) return;
  
    const s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
      (item) => item.id === cid
    );
    if (s_cardIndex < 0) return;
  
    const t_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
    if (t_boardIndex < 0) return;
  
    const t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cid
    );
    if (t_cardIndex < 0) return;
  
    const tempBoards = [...boards];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    setBoards(tempBoards);
  
    setTargetCard({
      bid: "",
      cid: "",
    });
  
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
  
      await axios.put(
        '/api/boards/drag',
        {
          sourceBoard: bid,
          targetBoard: targetCard.bid,
          cardId: cid,
          newPosition: t_cardIndex,
        },
        config
      );
    } catch (err) {
      console.error('Error updating card position:', err.response?.data || err.message);
      setError('Failed to update card position. Please try again.');
    }
  };

  const dragEntered = (bid, cid) => {
    if (targetCard.cid === cid) return;
    setTargetCard({
      bid,
      cid,
    });
  };

  const updateCard = async (bid, cid, card) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;
    setBoards(tempBoards);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(
        '/api/boards/drag',
        {
          sourceBoard: bid,
          targetBoard: targetCard.bid,
          cardId: cid,
          newPosition: t_cardIndex,
        },
        config
      );
    } catch (err) {
      console.error('Error updating card position:', err.response?.data || err.message);
      // setError('Failed to update card position. Please try again.');
    }
  };

  // Show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eef5db] to-[#c8e7d1]">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="ml-14 md:ml-56 flex-1 p-6 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#006663] border-t-transparent mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-[#006663]">Loading your boards...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no user is logged in, show login message
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eef5db] to-[#c8e7d1]">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="ml-14 md:ml-56 flex-1 p-6 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center">
              <h1 className="text-3xl font-semibold text-[#006663] mb-4">Please Log In</h1>
              <p className="text-gray-600">You need to log in to view and manage your task boards</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef5db] to-[#c8e7d1]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="ml-14 md:ml-56 flex-1 p-6">
          <div className="bg-gradient-to-r from-[#006663] to-[#111111] rounded-xl shadow-lg p-6 mb-6 backdrop-blur-sm border border-white/20">
            <h1 className="text-3xl font-semibold text-white mb-2">Task Boards</h1>
            <p className="text-gray-300">
              Welcome {user.name || user.email}! 
              {user.role && <span className="text-[#8dd4b6]"> ({user.role})</span>}
            </p>
          </div>
          
          {error && (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm" role="alert">
    <div className="flex items-center">
      <div className="py-1">
        <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
        </svg>
      </div>
      <div>
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  </div>
)}
          
          <div className="w-full h-full overflow-x-auto pt-5">
            <div className="h-full w-fit flex gap-8">
              {boards.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -top-3 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => removeBoard(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <Board
                    key={item.id}
                    board={item}
                    addCard={addCardHandler}
                    removeBoard={() => removeBoard(item.id)}
                    removeCard={removeCard}
                    dragEnded={dragEnded}
                    dragEntered={dragEntered}
                    updateCard={updateCard}
                  />
                </div>
              ))}
              <div className="flex-basis-[290px] min-w-[290px]">
                <Editable
                  displayClass="bg-gradient-to-r from-[#006663] to-[#111111] text-white rounded-xl shadow-lg w-full text-center p-4 hover:shadow-xl transition-all duration-300 border border-white/20"
                  editClass="bg-white rounded-lg p-3 shadow-inner"
                  placeholder="Enter Board Name"
                  text="Add New Board"
                  buttonText="Create Board"
                  onSubmit={addboardHandler}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
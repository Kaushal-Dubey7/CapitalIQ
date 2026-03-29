import { createContext, useContext, useState } from 'react';

const UserDataContext = createContext(null);

export const UserDataProvider = ({ children }) => {
  // Simple structure to store user's financial context temporarily
  // if we want to share it between pages without refetching from DB
  const [healthScoreData, setHealthScoreData] = useState(null);
  const [firePlanData, setFirePlanData] = useState(null);

  return (
    <UserDataContext.Provider 
      value={{ 
        healthScoreData, setHealthScoreData,
        firePlanData, setFirePlanData
      }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);

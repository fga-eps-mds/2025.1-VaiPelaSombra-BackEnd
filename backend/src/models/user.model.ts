export interface User {
  id: number;              
  name: string;                   
  email: string;                  
  password: string;                 
  createdAt: Date;              
  profileBio: string | null;      
  profileImage: string | null;     
  travelPreferences?: number | null; 
};
import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface IFood {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export type InputFood = Omit<IFood, 'id' | 'available'>;

const Dashboard = () => {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get<IFood[]>('/foods');
      setFoods(response.data);
    }

    loadFoods();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: IFood) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  const handleDeleteFood = async (id: number) => {
    try {
      await api.delete(`/foods/${id}`);
      setFoods(foods.filter((food) => food.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddFood = async (food: InputFood) => {
    try {
      const response = await api.post<IFood>('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateFood = async (food: IFood) => {
    const response = await api.put<IFood>(`/foods/${editingFood.id}`, {
      ...editingFood,
      ...food,
    });
    const updatedFoods = foods.map((f) =>
      f.id === editingFood.id ? response.data : f
    );
    setFoods(updatedFoods);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;

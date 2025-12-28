import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { TIngredient } from '@utils-types';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getIngredientsData } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  
  const location = useLocation();
  const ingredients = useSelector(getIngredientsData);
  const ingredientToFind = location.pathname.replace('/ingredients/', '');

  const ingredientData: TIngredient = ingredients.find(
    (ingredient) => ingredient._id === ingredientToFind
  )!;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

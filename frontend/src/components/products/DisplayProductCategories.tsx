import { FC, useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export interface Category {
  name: string;
  _id: string;
  description: string;
  parent: string;
  slug: string;
}

interface DisplayProductCategoriesProps {
  category: Category;
}

const DisplayProductCategories: FC<DisplayProductCategoriesProps> = ({
  category,
}): JSX.Element => {
  // Each product NEEDS to have a category, so there's no need for a check whether category exists
  const [categoryTree, setcategoryTree] = useState([]);

  const findCategoryTree = async (_id: string): Promise<void> => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/categories/category/root/${_id}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
    setcategoryTree(res.data.data);
  };

  useEffect(() => {
    findCategoryTree(category._id);
  }, [category]);
  // IMPORTANT! categoryTree will be in root - > child order (animals -> domestic animals - > cats)
  // For some weird reason I need to add key on <Fragment>
  return (
    <Fragment>
      <p>
        {`Categories: `}{' '}
        {categoryTree.map((category: Category, index: number) => {
          return (
            <Fragment key={category._id}>
              <Link to={`/category/${category.slug}`}>{category.name}</Link>
              {index !== categoryTree.length - 1 ? ` --> ` : null}
            </Fragment>
          );
        })}
      </p>
    </Fragment>
  );
};

export default DisplayProductCategories;

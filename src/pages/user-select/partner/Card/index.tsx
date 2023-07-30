import { useState } from 'react';
import styles from './Cards.module.scss';

interface Kind {
    id: number;
    name: string;
};

interface Props {
    partnerData: Kind[];
};

interface IClassname {
  [key: string]: boolean;
};

const classNames = (classes: IClassname) => 
  Object.entries(classes)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(' ');

const Cards: React.FC<Props> = ({ partnerData }) => {
  const [active, setActive] = useState<number[]>([]);
  console.log(partnerData);

  const handleClick = (id: number) => {
    if (active.includes(id)) {
      setActive(active.filter((activeId) => activeId !== id));
      //id가 배열에 들어 있으면 필터링해서 안들어있는 애들로 배열을 다시 만듬
    } else {
      setActive([...active, id]);
      //id가 배열에 없다면 그냥 배열에 넣기 
    }
  }

  return (
    <div>
      <div className={styles.container}>
        {
          partnerData.map((data) => (
            <div className={classNames({
            [styles['card']]: true,
            [styles['card__active']]: active.includes(data.id),
            })} onClick={() => handleClick(data.id)}>
              <div className={styles['card__image']}></div>
              <div key={data.id} className={styles['card__title']}>{data.name}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Cards;
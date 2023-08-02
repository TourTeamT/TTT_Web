import React, { useState } from "react";
import { useUserSelectData } from "pages/user-select";
import { ReactComponent as Check } from 'assets/svg/plan/check.svg'
import Next from "components/button/next";
import Back from "components/button/back";
import cn from "utils/classnames";
import styles from './time.module.scss';

const formatDateToMMDD = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month < 10 ? "0" : ""}${month}.${day < 10 ? "0" : ""}${day}`;
};

const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const roundedMinutes = Math.floor(minutes / 30) * 30; // Round down to the nearest 30 minutes
  return `${hours < 10 ? "0" : ""}${hours}:${roundedMinutes === 0 ? "00" : roundedMinutes}`;
};

const TimeInput: React.FC<{
  hours: string;
  minutes: string;
  onChange: (hours: string, minutes: string) => void;
}> = ({ hours, minutes, onChange }) => {
  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value, minutes);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(hours, e.target.value);
  };

  const hoursOptions = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    hoursOptions.push(
      <option key={hour} value={hour}>
        {hour}
      </option>
    );
  }

  const minutesOptions = ["00", "30"].map((minute) => (
    <option key={minute} value={minute}>
      {minute}
    </option>
  ));

  return (
    <div>
      <select className={styles.select} value={hours} onChange={handleHourChange}>
        {hoursOptions}
      </select>
      :
      <select className={styles.select} value={minutes} onChange={handleMinuteChange}>
        {minutesOptions}
      </select>
    </div>
  );
};


export default function Time() {
  const userSelectDataArray = useUserSelectData();

  const userSelectData = Array.isArray(userSelectDataArray)
    ? userSelectDataArray[0]
    : userSelectDataArray;

  const { partner, place, date, time } = userSelectData || {};
  const [formState, setFormState] = React.useState<any[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = React.useState<number | null>(0); // Keep track of the selected day index

  const getDatesBetween = (): string[] => {
    if (date && date.startDate && date.endDate) {
      const dates: string[] = [];
      let currentDate = new Date(date.startDate);
      const endDate = new Date(date.endDate);

      while (currentDate <= endDate) {
        dates.push(formatDateToMMDD(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    }
    return [];
  };

  const datesBetween: string[] = getDatesBetween();
  React.useEffect(() => {
    const initialFormState = datesBetween.map(() => ({}));
    setFormState(initialFormState);
  }, []);

  const handleFormChange = (index: number, field: string, value: any) => {
    setFormState((prevState) => {
      const updatedForm = [...prevState];
      if (!updatedForm[index]) {
        updatedForm[index] = {};
      }
      updatedForm[index][field] = value;
      return updatedForm;
    });
  };

  const handleDayClick = (index: number) => {
    setSelectedDayIndex(index === selectedDayIndex ? null : index);
  };

  const toggleMealStatus = (index: number, mealType: string) => {
    const updatedForm = [...formState];
    if (!updatedForm[index]) {
      updatedForm[index] = {};
    }
    updatedForm[index][mealType] = !updatedForm[index][mealType];
    setFormState(updatedForm);
  };

  return (
    <div className={styles.template}>
      <div>
        {datesBetween.map((item: string, index: number) => (
          <div key={item} className={styles.container}>
            <div className={cn({
                      [styles.date]: true,
                      [styles['date--select']]: selectedDayIndex === index,
                    })}>
              <span onClick={() => handleDayClick(index)}>{index + 1}일차</span>
            </div>
            <div>
            {selectedDayIndex === index && (
              <div className={styles.container__content}>
                <div className={styles.day}>
                <div className={styles.day__date}>{ datesBetween[index] }</div>
                <div className={styles.day__count}>{index + 1}일차</div>
              </div>
              <div className={styles.content}>
                <div className={styles.title}>활동 시간</div>
                <div className={styles.description}>상황에 따라 약간의 오차가 발생할 수 있습니다.</div>
                <div className={styles.active}>
                  <div className={styles.time}>
                    <TimeInput
                      hours={formState[index]?.startTime?.split(':')[0] || "00"}
                      minutes={formState[index]?.startTime?.split(':')[1] || "00"}
                      onChange={(hours, minutes) => handleFormChange(index, "startTime", `${hours}:${minutes}`)}
                    />
                  </div>
                   ~
                  <div className={styles.time}>
                    <TimeInput
                      hours={formState[index]?.endTime?.split(':')[0] || "00"}
                      minutes={formState[index]?.endTime?.split(':')[1] || "00"}
                      onChange={(hours, minutes) => handleFormChange(index, "endTime", `${hours}:${minutes}`)}
                    />
                  </div>
                </div>
                <div className={styles.title}>식사여부</div>
                <div className={styles.description}>식사가 예상되는 시간을 전부 선택해 주세요.</div>
                <div className={styles.meal}>
                  <div
                    className={cn({
                      [styles.mealTime]: true,
                      [styles['mealTime--select']]: formState[index]?.isBreakfast,
                    })}
                    onClick={() => toggleMealStatus(index, "isBreakfast")}>
                    아침
                  </div>
                  <div
                    className={cn({
                      [styles.mealTime]: true,
                      [styles['mealTime--select']]: formState[index]?.isLunch,
                    })}
                    onClick={() => toggleMealStatus(index, "isLunch")}>
                    점심
                  </div>
                  <div
                    className={cn({
                      [styles.mealTime]: true,
                      [styles['mealTime--select']]: formState[index]?.isDinner,
                    })} 
                    onClick={() => toggleMealStatus(index, "isDinner")}>
                    저녁
                  </div>
                </div>
                <div className={styles.title}>식사 소요시간</div>
                <div className={styles.description}>각 식사 별 예상 소요 시간을 선택 해주세요.</div>
                <div className={styles.mealSpend}>
                  <TimeInput
                    hours={formState[index]?.mealTime?.split(':')[0] || "00"}
                    minutes={formState[index]?.mealTime?.split(':')[1] || "00"}
                    onChange={(hours, minutes) => handleFormChange(index, "mealTime", `${hours}:${minutes}`)}
                  />
                </div>
                  <div className={styles.button}>
                    { index !== 0 && <Back setState={() => handleDayClick(index - 1)}/> }
                    { index !== datesBetween.length ? (
                        <Next setState={() => handleDayClick(index + 1)} /> 
                      ) : (
                        <Next setState={() => console.log('보내기')} />
                      )
                    }
                  </div>
              </div>
            </div>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
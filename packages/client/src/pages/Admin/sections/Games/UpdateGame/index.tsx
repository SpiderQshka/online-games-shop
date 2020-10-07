import { useApi } from "context/api";
import { useFormik } from "formik";
import {
  IApiError,
  IGame,
  IGameCreatorFromApi,
  IGenreFromApi,
} from "interfaces/api";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";
import { IGameForUI } from "interfaces/app";
import moment from "moment";

interface UpdateGameProps {
  games: IGameForUI[];
  gameCreators: IGameCreatorFromApi[];
  genres: IGenreFromApi[];
}

export const UpdateGame: React.FunctionComponent<UpdateGameProps> = ({
  games,
  gameCreators,
  genres,
}) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const game = games.filter((game) => game.id === +id)[0];
  const { putGame } = useApi();
  const [error, setError] = useState<IApiError | null>();
  const formik = useFormik({
    initialValues: {
      numberOfPhysicalCopies: game.numberOfPhysicalCopies,
      name: game.name,
      logo: game.logo,
      description: game.description,
      ageRating: game.ageRating,
      price: game.price,
      createdAt: moment(game.createdAt).format("YYYY-MM-DD"),
      genresIds: game.genres.map((genre) => genre.id),
      gameCreatorId: game.gameCreator.id,
    } as IGame,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(5, "Name should be at least 5 characters long")
        .required("Required"),
      logo: Yup.string().required("Required"),
      description: Yup.string()
        .min(30, "Description should be at least 30 characters long")
        .required("Required"),
      ageRating: Yup.number().min(0).max(21).required("Required"),
      price: Yup.number().min(1).required("Required"),
      numberOfPhysicalCopies: Yup.number().min(0).required("Required"),
      gameCreatorId: Yup.number().min(1).required("Required"),
      createdAt: Yup.string().required("Required"),
      genresIds: Yup.array()
        .of(Yup.number().min(1))
        .min(1)
        .required("Required"),
    }),
    onSubmit: (data) => {
      putGame(game.id, {
        ...data,
        createdAt: new Date(data.createdAt).toISOString(),
      }).then(({ game, error }) => {
        if (error) setError(error);
        else history.push("/admin/games");
      });
    },
  });

  return (
    <div className={styles.itemContent}>
      <h2 className={styles.header}>Update game with id {game.id}</h2>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <span className={styles.labelText}>Name</span>
          <input
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.nameInput}`}
            value={formik.values.name}
          />
        </label>
        {!!formik.touched.name && !!formik.errors.name && (
          <p className={styles.errorMsg}>{formik.errors.name}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Link to logo</span>
          <input
            name="logo"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.logoInput}`}
            value={formik.values.logo}
          />
        </label>
        {!!formik.touched.logo && !!formik.errors.logo && (
          <p className={styles.errorMsg}>{formik.errors.logo}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Description</span>
          <input
            name="description"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.descriptionInput}`}
            value={formik.values.description}
          />
        </label>
        {!!formik.touched.description && !!formik.errors.description && (
          <p className={styles.errorMsg}>{formik.errors.description}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Age rating</span>
          <input
            name="ageRating"
            type="number"
            min="0"
            max="21"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.ageRatingInput}`}
            value={formik.values.ageRating}
          />
        </label>
        {!!formik.touched.ageRating && !!formik.errors.ageRating && (
          <p className={styles.errorMsg}>{formik.errors.ageRating}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Genres</span>
          <select
            multiple
            name="genresIds"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.genresIdsInput}`}
            value={formik.values.genresIds.map((el) => `${el}`)}
          >
            {genres.map((el, i) => (
              <option value={el.id} key={el.id}>
                {el.name}
              </option>
            ))}
          </select>
        </label>
        {!!formik.touched.genresIds && !!formik.errors.genresIds && (
          <p className={styles.errorMsg}>{formik.errors.genresIds}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Price</span>
          <input
            name="price"
            type="number"
            min="1"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.priceInput}`}
            value={formik.values.price}
          />
        </label>
        {!!formik.touched.price && !!formik.errors.price && (
          <p className={styles.errorMsg}>{formik.errors.price}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Number of physical copies</span>
          <input
            name="numberOfPhysicalCopies"
            type="number"
            min="0"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.numberOfPhysicalCopiesInput}`}
            value={formik.values.numberOfPhysicalCopies}
          />
        </label>
        {!!formik.touched.numberOfPhysicalCopies &&
          !!formik.errors.numberOfPhysicalCopies && (
            <p className={styles.errorMsg}>
              {formik.errors.numberOfPhysicalCopies}
            </p>
          )}
        <label className={styles.label}>
          <span className={styles.labelText}>Creation date</span>
          <input
            name="createdAt"
            type="date"
            max={Date.now()}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.creationDateInput}`}
            value={formik.values.createdAt}
          />
        </label>

        {!!formik.touched.createdAt && !!formik.errors.createdAt && (
          <p className={styles.errorMsg}>{formik.errors.createdAt}</p>
        )}
        <label className={styles.label}>
          <span className={styles.labelText}>Game creator</span>
          <select
            name="gameCreatorId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${styles.gameCreatorIdInput}`}
            value={formik.values.gameCreatorId}
          >
            {gameCreators.map((el, i) => (
              <option value={el.id} key={el.id}>
                {el.name}
              </option>
            ))}
          </select>
        </label>
        {!!formik.touched.gameCreatorId && !!formik.errors.gameCreatorId && (
          <p className={styles.errorMsg}>{formik.errors.gameCreatorId}</p>
        )}
        <button
          type="submit"
          className={`${styles.button} ${styles.submitButton} ${
            true && styles.active
          }`}
        >
          Update
        </button>
        {!!error && <p className={styles.errorMsg}>{error.msg}</p>}
      </form>
    </div>
  );
};

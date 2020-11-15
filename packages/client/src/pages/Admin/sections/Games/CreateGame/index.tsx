import { useApi } from "context/api";
import { useFormik } from "formik";
import {
  IApiError,
  IGame,
  IGameCreatorFromApi,
  IGenreFromApi,
} from "interfaces/api";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "components/AdminItem/styles.module.scss";
import * as Yup from "yup";
import moment from "moment";
import { toBase64 } from "utils/helpers";

interface CreateGameProps {
  gameCreators: IGameCreatorFromApi[];
  genres: IGenreFromApi[];
  updateTrigger: boolean;
  setUpdateTrigger: (trigger: boolean) => void;
}

export const CreateGame: React.FunctionComponent<CreateGameProps> = ({
  setUpdateTrigger,
  updateTrigger,
  genres,
  gameCreators,
}) => {
  const history = useHistory();
  const { postGame } = useApi();
  const [error, setError] = useState<IApiError | null>();
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      numberOfPhysicalCopies: 0,
      name: "",
      logo: null,
      description: "",
      ageRating: 0,
      price: 1,
      createdAt: moment().format("YYYY-MM-DD"),
      genresIds: [],
      gameCreatorId: 1,
      physicalCopyPrice: 1,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(5, "Name should be at least 5 characters long")
        .required("Required"),
      logo: Yup.mixed().required("Required"),
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
      physicalCopyPrice: Yup.number().min(1).required("Required"),
    }),
    onSubmit: (data) => {
      setIsLoading(true);
      const logo = (formik.values.logo as any) as File;
      toBase64(logo).then((logo) => {
        setBaseImage(logo);
        postGame({ ...data, logo }).then(({ game, error }) => {
          setIsLoading(false);
          if (error) setError(error);
          else {
            setUpdateTrigger(!updateTrigger);
            history.push("/admin/games");
          }
        });
      });
    },
  });

  useEffect(() => {
    const processAsync = async () => {
      if (formik.values.logo) {
        const baseString = await toBase64(formik.values.logo as any);
        setBaseImage(baseString);
      }
    };
    processAsync();
  }, [formik.values.logo]);

  return (
    <>
      <div className={styles.itemContent}>
        <h2 className={styles.header}>Create game</h2>
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
            <span className={styles.labelText}>Logo</span>
            <input
              name="logo"
              type="file"
              onChange={(event) => {
                const files = event.currentTarget.files as FileList;
                formik.setFieldValue("logo", files[0]);
              }}
              onBlur={formik.handleBlur}
              className={`${styles.input} ${styles.nameInput}`}
            />
          </label>
          {!!formik.touched.logo && !!formik.errors.logo && (
            <p className={styles.errorMsg}>{formik.errors.logo}</p>
          )}
          <img
            src={baseImage || "#"}
            alt="Game logo"
            height="200px"
            className={`${styles.previewImage} ${baseImage || styles.hidden}`}
          />
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
              min="0"
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
            <span className={styles.labelText}>Price for physical copy</span>
            <input
              name="physicalCopyPrice"
              type="number"
              min="1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${styles.input} ${styles.priceInput}`}
              value={formik.values.physicalCopyPrice}
            />
          </label>
          {!!formik.touched.physicalCopyPrice &&
            !!formik.errors.physicalCopyPrice && (
              <p className={styles.errorMsg}>
                {formik.errors.physicalCopyPrice}
              </p>
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
              max={moment(Date.now()).format("YYYY-MM-DD")}
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
          <div
            className={`${styles.actionsBlock} ${isLoading && styles.loading}`}
          >
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
            >
              Create
            </button>
            <button
              type="reset"
              onClick={formik.handleReset}
              className={`${styles.button} ${styles.resetButton}`}
            >
              Reset
            </button>
          </div>
          {!!error && <p className={styles.errorMsg}>{error.msg}</p>}
        </form>
      </div>
    </>
  );
};

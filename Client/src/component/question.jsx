import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CommentSection from "./CommentSection";
import Subsection from "./Subsection";
import Form from "./Form";
import { useDispatch } from "react-redux";
import {
  askQuestionAction,
  fetchQuestionsAction,
} from "../Redux/Action/questionAction";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { currentUserAction } from "../Redux/Action/userAction";
import { useTranslation } from "react-i18next";

function Ques() {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const { questions } = useSelector((state) => state.question);

  useEffect(() => {
    dispatch(fetchQuestionsAction());
  }, [dispatch]);

  const handleCommentSubmit = async (question) => {
    dispatch(askQuestionAction(question))
      .unwrap()
      .then(() => {
        dispatch(fetchQuestionsAction());
      });
    setComment(" ");
  };
  const navigate = useNavigate();
  const handleQuestionPreview = (questionId) => {
    // Add navigation logic to preview question page
    navigate(`/question-preview/${questionId}`);
  };
  const userContributions = {};

  questions?.forEach((question) => {
    const userId = question.user?._id;

    if (!userContributions[userId]) {
      userContributions[userId] = {
        userData: question.user,
        questions: 1,
        answers: 0,
      };
    } else {
      userContributions[userId].questions += 1;
    }

    // Calculate user contributions from answers
    question.answers.forEach((answer) => {
      const answerUserId = answer.user._id;

      if (!userContributions[answerUserId]) {
        userContributions[answerUserId] = {
          userData: answer.user,
          questions: 0,
          answers: 1,
        };
      } else {
        userContributions[answerUserId].answers += 1;
      }
    });
  });
  const userContributionsArray = Object.values(userContributions);
  userContributionsArray.sort(
    (a, b) => b.questions + b.answers - (a.questions + a.answers)
  );

  const top5UserContributions = userContributionsArray.slice(0, 5);
  const { t } = useTranslation();
  const maxLength = 150;
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(currentUserAction());
  }, [dispatch]);
  return (
    <Container className="mt-4" >
      <Row>
        <div>
        <h4>{t('programmingQuestionsPage.pageTitle')}</h4>
          <p>{t('programmingQuestionsPage.pageDescription')}</p>
        </div>
        <hr className="mt-4" />
        <Col lg={6} md={12} className="mt-4">
          {questions?.length > 0 ? (
            questions.map((question, index) => (
              <Row key={index} className="mb-3 border p-3 rounded">
                <Col>
                  <span
                    onClick={() => handleQuestionPreview(question._id)}
                    style={{ cursor: "pointer" }}
                    className="text-muted d-flex col justify-content-between"
                  >
                    <span>
                      <p className="mb-1">
                        {question?.text.length > maxLength ? (
                          <>
                            {question?.text.slice(0, maxLength)}
                            {"... "}
                            <span
                              className="text-primary"
                              style={{ cursor: "pointer" }}
                            >
                           {t('programmingQuestionsPage.readMore')}
                            </span>
                          </>
                        ) : (
                          <>{question.text}</>
                        )}
                      </p>
                      <p>
                        {question.answers.length} {t('programmingQuestionsPage.numberOfAnswers')} | {question.votes.length}{" "}
                        {t('programmingQuestionsPage.numberOfVotes')}
                      </p>
                      &bull; {t('programmingQuestionsPage.questions')}{" "}
                      <strong>
                        {question.user?.firstName || question.firstName}{" "}
                        {question.user?.lastName || question.lastName}
                      </strong>{" "}
                      {t('bookTable.at')} {new Date(question.createdAt).toLocaleString()}
                    </span>
                  </span>
                </Col>
              </Row>
            ))
          ) : (
            <h3>{t('programmingQuestionsPage.noQuestionsMessage')}</h3>
          )}
          <hr className="my-4" />

          <CommentSection
           placeholder={t('programmingQuestionsPage.addQuestionPlaceholder')}
           buttonText={t('programmingQuestionsPage.addQuestionButtonText')}
           comment={comment}
            onCommentChange={(e) => setComment(e.target.value)}
            onCommentSubmit={handleCommentSubmit}
          />
        </Col>
        <Col lg={6} md={12} className="mb-4">
          <div className="p-4">
          <h4>{t('programmingQuestionsPage.contributorsTitle')}</h4>
            <ul>
              {Object.keys(top5UserContributions).map((userId) => {
                const userContribution = top5UserContributions[userId];
                if (userContribution.userData) {
                  return (
                    <Row key={userId} className="my-3 border p-3 rounded">
                      <span>
                        <strong>
                          {userContribution.userData.firstName}{" "}
                          {userContribution.userData.lastName}
                        </strong>
                        <br />
                        {t('programmingQuestionsPage.questions')}: {userContribution.questions} | {t('programmingQuestionsPage.answers')}:{" "}
                        {userContribution.answers}
                      </span>
                    </Row>
                  );
                }

                return null;
              })}
            </ul>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
        <h4>{t('programmingQuestionsPage.sectionSubTitle')}</h4>
          <Subsection />
          <Subsection />
          <Subsection />
          <Subsection />
        </Col>
      </Row>
      {!currentUser && (
        <Row>
          <Col md={12}>
            <Form />
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Ques;

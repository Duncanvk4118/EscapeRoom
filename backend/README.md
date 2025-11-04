BACKEND

# Admin user flow.

1. Create Escape room

    POST /api/admin/escape-room
    body: {name}
    backend: create escape-room in database using models with name and user id

2. Create questions

    POST /api/admin/questions
    body: {type, question, description, location(name), lat, long, points}
    backend: create question in database using models with all supplied info and add user id.

3. Add questions to escape room

    POST /api/admin/escape-room/:id/questions
    body {question_id}
    backend: link question to escape room, use link table er_questions using models

4. If questions are added to escape room, escape room should be able to start.

    POST /api/admin/escape-room/:id/create-session
    body {teams: int}
    backend: create amount of teams and return the team codes for the team players to use, also create the questions for each team

# Team User Flow

1. Login using team code and username

    POST /api/team/auth/check-team
    body: {team-code}

    POST /api/team/auth/login
    body: {team-code, username}
    backend: return authentication jwt

2. Ability to get leaderboard, questions, etc.

    GET /api/game/get-question
    RETURNS: Title and location description, use shift to get correct question, if there are 20 questions and 4 teams each team should have a shift of 5 in this case, first team will begin at question 1, second at question 5 third at question 10 etc.

    works: check which question is lastly finished, check what is the next question, 


    GET /api/game/get-question/:jwt_token
    RETURNS: All question data
    BACKEND: changes state to scanned and now /get-question/ will also return all data.

    POST /api/game/answer-question
    body: {question_id, answer_id}
    RETURNS: Valid / not valid
    BACKEND: changes state to finished and /get-question/ will now return the new question
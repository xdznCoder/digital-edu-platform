export interface ApiMap {
  "/user/sendCode": {
    req: { identifier: string };
    resp: null;
  };
  "/user/login": {
    req: {
      username: string;
      password: string;
      emailCode: string;
      loginType: number;
    };
    resp: {
      id: string;
      username: string;
      nickname: string;
      avatar: string;
      type: number;
      token: string;
    };
  };
  "/user/regist": {
    req: {
      username: string;
      password: string;
      email: string;
      nickname: string;
      avatar: string;
      type: number;
      code: string;
    };
    resp: null;
  };
  "/class/list": {
    req: { pageNum: number; pageSize: number; key: string };
    resp: {
      list: Array<{
        id: number;
        classCode: string;
        courseId: number;
        currentStudents: number;
        status: number;
        gmtCreate: string;
        gmtModified: string;
        tid: number;
      }>;
      total: number;
      current: number;
      size: number;
      sizes: number;
    };
  };
  "/class": {
    req: { code: string };
    resp: null;
  };
  "/class/:id":
    | {
        req: { id: number };
        resp: {
          id: number;
          classCode: string;
          courseId: number;
          currentStudents: number;
          status: number;
          gmtCreate: string;
          gmtModified: string;
          isDeleted: number;
          tid: number;
        };
      }
    | {
        req: { id: number };
        resp: null;
      };
  "/class/student/list": {
    req: { pageNum: number; pageSize: number; cid: number; key: string };
    resp: {
      list: Array<{
        sno: string;
        name: string;
        cid: number;
        id: number;
      }>;
      total: number;
      current: number;
      size: number;
      sizes: number;
    };
  };
  "/class/student": {
    req: Array<number>;
    resp: null;
  };
  "/class/upload": {
    req: { id: number; file: File };
    resp: null;
  };
  "/class/upload/single": {
    req: { sno: string; name: string; cid: number };
    resp: null;
  };
  "/game/upload": {
    req: {
      file: File;
      teamNum: number;
      studentNum: number;
      teamMemberCount: number;
      cid: number;
    };
    resp: {
      teamNum: number;
      studentNum: number;
      successTeamNum: number;
      failTeamNum: number;
      successStudentNum: number;
      failStudentNum: number;
      addStudentNum: number;
      gameId: number;
    };
  };
  "/game/list/:cid": {
    req: { cid: number };
    resp: Array<{
      id: number;
      cid: number;
      studentCount: number;
      teamCount: number;
      teamMemberCount: number;
      stage: number;
      chessRound: number;
      chessPhase: number;
      proposalStage: number;
      proposalRound: number;
      status: number;
      lastSavedAt: string;
      gmtCreate: string;
      gmtUpdate: string;
    }>;
  };
  "/team/game/:id": {
    req: { id: number };
    resp: {
      teams: Array<{
        studentId: number;
        studentName: string;
        studentSno: string;
        isLeader: boolean;
      }>;
      freeStudents: Array<{
        teamId: number;
        leaderName: string;
        leaderId: number;
        totalMembers: number;
        members: Array<{
          studentId: number;
          studentName: string;
          studentSno: string;
          isLeader: boolean;
        }>;
        leaderSno: string;
      }>;
    };
  };
  "/game/board/init": {
    req: {
      gameId: number;
      totalTiles: number;
      blackSwampTiles: number[];
      blindBoxTiles: { tileId: number; eventType: number }[];
      fortressTiles: { tileId: number; gameType: number }[];
      goldCenterTiles: number[];
      opportunityTiles: number[];
    };
    resp: null;
  };
  "/game/status/:id": {
    req: { id: number };
    resp: {
      id: number;
      cid: number;
      studentCount: number;
      teamCount: number;
      teamMemberCount: number;
      stage: number;
      chessRound: number;
      chessPhase: number;
      proposalStage: number;
      proposalRound: number;
      status: number;
      lastSavedAt: string;
      gmtCreate: string;
      gmtUpdate: string;
    };
  };
  "/game/upload/chess": {
    req: { gameId: number; file: File };
    resp: Array<{
      teamId: number;
      teamName: string;
      thisRoundScore: number;
      submitTime: string;
    }>;
  };
  "/game/rank/team/:id": {
    req: { id: number };
    resp: Array<{
      teamId: number;
      leaderName: string;
      totalTile: number;
      leaderSno: string;
      totalScore: number;
      status: number;
    }>;
  };
  "/game/upload/assign": {
    req: { gameId: number; teamAssignCount: Record<number, number> };
    resp: null;
  };
  "/game/xxt/rank/:id": {
    req: { id: number };
    resp: Array<{
      teamId: number;
      teamName: string;
      thisRoundScore: number;
      submitTime: string;
    }>;
  };
  "/game/unselected/:gameId": {
    req: { gameId: number };
    resp: Array<{
      teamId: number;
      leaderName: string;
      leaderId: number;
      sno: string;
      assignCount: number;
    }>;
  };
  "/game/occupyStatus/:gameId": {
    req: { gameId: number };
    resp: {
      totalTiles: number;
      blackSwampTiles: number[];
      blindBoxTiles: number[];
      fortressTiles: number[];
      goldCenterTiles: number[];
      opportunityTiles: number[];
      teams: Array<{
        teamId: number;
        occupiedTiles: number[];
      }>;
    };
  };
  "/game/tile/occupy": {
    req: {
      gameId: number;
      teamId: number;
      tileIds: number[];
      triggerBlindBox: boolean;
      blindBoxTileIds: number[];
      triggerGoldCenter: boolean;
      goldCenterTileId: number;
      triggerChanceLand: boolean;
      chanceLandTileId: number;
      challengeSuccess: boolean;
    };
    resp: null;
  };
  "/game/special/list": {
    req: { gameId: number };
    resp: Array<{
      teamId: number;
      unTriggeredTiles: Array<{
        tileId: number;
        tileType: number;
        eventType: number;
        eventName: string;
      }>;
    }>;
  };
  "/game/special/blind-box/settle": {
    req: {
      gameId: number;
      teamId: number;
      tileId: number;
      eventType: number;
      involvedTeamIds: number[];
      winnerTeamId: number;
    };
    resp: null;
  };
  "/game/special/fortress/settle": {
    req: {
      gameId: number;
      tileId: number;
      attackerTeamId: number;
      defenderTeamId: number;
      winnerTeamId: number;
      gameType: number;
    };
    resp: null;
  };
  "/game/rank/student/:id": {
    req: { id: number };
    resp: Array<{
      studentId: number;
      studentName: string;
      individualScore: number;
      memberSno: string;
      teamId: number;
    }>;
  };
  "/game/score/update": {
    req: {
      type: 0;
      stage: 0;
      id: 0;
      gameId: 0;
      num: 0;
      comment: "";
    };
    resp: null;
  };
  "/proposal/init": {
    req: Array<{
      teamId: number;
      initialScore: number;
      gameId: number;
    }>;
    resp: null;
  };
  "/proposal/order": {
    req: {
      gameId: number;
      roundTeamIds: number[][];
    };
    resp: null;
  };
  "/proposal/upload/first": {
    req: {
      gameId: number;
      num: number;
      proposals: Array<{
        proposerTeamId: number;
        involvedTeamIds: number[];
        scoreDistribution: number[];
      }>;
    };
    resp: null;
  };
  "/proposal/list": {
    req: { gameId: number; round: number };
    resp: Array<{
      id: number;
      proposerTeamId: number;
      proposerTeamName: string;
      involvedTeamIds: number[];
      scoreDistribution: number[];
      voteCount: number;
      isSelected: boolean;
    }>;
  };
  "/proposal/vote": {
    req: {
      gameId: number;
      round: number;
      votes: Array<{
        teamId: number;
        score: number;
        proposalId: number;
      }>;
    };
    resp: null;
  };
  "/proposal/upload/first/xxt": {
    req: { gameId: number; file: File };
    resp: Array<{
      teamId: number;
      teamName: string;
      thisRoundScore: number;
      submitTime: string;
      status: number;
    }>;
  };
  "/proposal/upload/second": {
    req: {
      gameId: number;
      num: number;
      proposals: {
        proposerTeamId: number;
        proTeamIds: number[];
        conTeamIds: number[];
      }[];
    };
    resp: null;
  };
  "/proposal/outTeam": {
    req: { gameId: number; teamIds: number[] };
    resp: { triggered: boolean };
  };
  "/proposal/second/need": {
    req: { gameId: number };
    resp: Array<number>;
  };
  "/proposal/debate/evaluate": {
    req: {
      gameId: number;
      proposalId: number;
      teacherScorePro: number;
      teacherScoreCon: number;
      studentScores: {
        fromTeamId: number;
        scorePro: number;
        scoreCon: number;
      }[];
    };
    resp: null;
  };
  "/proposal/upload/third": {
    req: {
      gameId: number;
      num: number;
      proposals: {
        proposerTeamId: number;
        involvedTeamIds: number[];
      }[];
    };
    resp: null;
  };
  "/proposal/rank/third": {
    req: { gameId: number };
    resp: Array<{
      teamId: number;
      leaderName: string;
      score: number;
      rank: number;
    }>;
  };
  "/proposal/settle": {
    req: { gameId: number };
    resp: null;
  };
  "/proposal/buzzed": {
    req: {
      gameId: number;
      teamId: number;
      score: number;
      comment: string;
    };
    resp: null;
  };
  "/proposal/rank/all": {
    req: { gameId: number };
    resp: Array<{
      teamId: number;
      score: number;
      rank: number;
      name: string;
    }>;
  };
  "/log/student/list": {
    req: {
      gameId: number;
      studentId: number;
      pageNum: number;
      pageSize: number;
    };
    resp: {
      list: {
        id: number;
        studentId: number;
        teamId: number;
        gameId: number;
        score: number;
        reason: number;
        round: number;
        phase: number;
        gmtCreate: string;
        comment: string;
      }[];
      total: number;
      current: number;
      size: number;
      sizes: number;
    };
  };
  "/log/team/list": {
    req: {
      gameId: number;
      teamId: number;
      pageNum: number;
      pageSize: number;
    };
    resp: {
      list: {
        id: number;
        teamId: number;
        gameId: number;
        score: number;
        reason: number;
        round: number;
        phase: number;
        gmtCreate: string;
        submitTime: string;
        comment: string;
      }[];
      total: number;
      current: number;
      size: number;
      sizes: number;
    };
  };
  "/log/stream": {
    req: { sno: number; gameId: number; message: string; type: string };
    resp: string;
  };
  "/user/update": {
    req: {
      id: number;
      username: string;
      nickname: string;
      avatar: string;
    };
    resp: null;
  };
  "/game/outTeam": {
    req: {
      gameId: number;
      teamIds: number[];
      type: number;
    };
    resp: null;
  };
  "/proposal/init/list": {
    req: { gameId: number; sort: number };
    resp: Array<number>;
  };
  "/proposal/selected/:game/:round": {
    req: { game: number; round: number };
    resp: {
      teamId: number;
      leaderName: string;
      score: number;
      proposalId: number;
      allocations: number[];
      team: number[];
      round: number;
    };
  };
}

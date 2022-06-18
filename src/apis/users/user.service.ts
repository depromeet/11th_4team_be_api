import { UserRepository } from 'src/repositories/user.repository';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from 'src/models/user.model';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { UpdateProfileReqDto } from './dto/updateUserDto.req.dto';
import { ReportRepository } from 'src/repositories/report.repository';
import { NicknameDto } from './dto/user.dto';
import { ReportResultDtoResDto } from './dto/reportResultDto.res.dto';
import { returnValueToDto } from 'src/common/decorators/returnValueToDto.decorator';
import { CanChangeNicknameResDto } from './dto/canChangeNickname.res.dto';
import { NewAlarmStateResDto } from './dto/newAlarmState.res.dto';
import { UserProfileDto } from 'src/common/dtos/UserProfile.dto';
import { BlockedUserDto } from 'src/common/dtos/BlockedUserList.dto';
import { AuthService } from 'src/auth/auth.service';
import { LightningRepository } from 'src/repositories/lightning.repository';
import { SendLightningSuccessDtoResDto } from './dto/sendLigningSuccessDto.res.dto';
import {
  USER_LEVELUP_COUNT_TYPE,
  USER_LEVEL_TYPE,
} from 'src/common/consts/enum';
import { AlarmService } from '../alarm/alarm.service';
import { FCMUpdateDto } from './dto/fcmUpdate.dto';
import { RoomsService } from '../rooms/rooms.service';
import { RoomIdDto } from 'src/common/dtos/RoomId.dto';
import { UserProfileClickDto } from './dto/UserProfileClick.dto';
import { OfficialNotiRepository } from 'src/repositories/officialNoti.repository';
import { OfficialNoti } from 'src/models/officialNoti';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private reportRepository: ReportRepository,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private lightnignRepository: LightningRepository,
    private alarmService: AlarmService,
    private roomService: RoomsService,
    private OfficialNotiRepository: OfficialNotiRepository,
  ) {}

  private checkBlocked(userIdDto: UserIdDto, blockedUserDto: BlockedUserDto) {
    // console.log('asdfasdfasdfasdfasdf', userIdDto.userId);
    if (blockedUserDto.blockedUsers.find((id) => id.equals(userIdDto.userId))) {
      throw new BadRequestException('차단된 유저입니다.');
    }
  }

  @returnValueToDto(User)
  async getUserInfo(userIdDto: UserIdDto): Promise<User> {
    // auto 시리얼 라이징
    const user = await this.userRepository.findOneByUserId(userIdDto);
    if (!user) {
      throw new InternalServerErrorException('잘못된 접근');
    }
    console.log(user);
    return user;
  }

  @returnValueToDto(UserProfileClickDto)
  async getOtherUserInfo(
    userIdDto: UserIdDto,
    myUser: User,
  ): Promise<UserProfileClickDto> {
    const user = await this.userRepository.findOneByUserId(userIdDto);
    if (!user) {
      throw new BadRequestException('유저 없음');
    }
    const iBlock = myUser.iBlockUsers.find((e) =>
      e._id.equals(userIdDto.userId),
    )
      ? true
      : false;
    return { ...user, iBlock: iBlock };
  }

  // @returnValueToDto(UserProfileDto)
  async signOutUser(user: User) {
    if (user.myRoom) {
      //유저가 들어간 방이있으면
      await this.roomService.pullUserFromRoom(
        new RoomIdDto(user.myRoom._id),
        user.userIdDto,
      );
    }

    await this.userRepository.signOutUser(user.userIdDto);
    return user;
  }
  @returnValueToDto(OfficialNoti)
  async getOfficialNoti() {
    return await this.OfficialNotiRepository.getOfficialNotis();
  }

  @returnValueToDto(User)
  async updateProfile(
    userIdDto: UserIdDto,
    updateProfileReqDto: UpdateProfileReqDto,
  ): Promise<User> {
    // auto 시리얼 라이징

    //TODO :  닉네임 변경시에 한번더 밸리데이션? 내프로필 정보랑 닉네임 일치하면 변경하고..
    return await this.userRepository.updateProfile(
      userIdDto,
      updateProfileReqDto,
    );
  }

  @returnValueToDto(UserProfileDto)
  async blockUser(
    myUserIdDto: UserIdDto,
    otherUserIdDto: UserIdDto,
  ): Promise<UserProfileDto[]> {
    if (myUserIdDto.userId.equals(otherUserIdDto.userId)) {
      throw new BadRequestException('내 자신 차단');
    }
    console.log(
      myUserIdDto.userId.equals(otherUserIdDto.userId),
      otherUserIdDto.userId,
      myUserIdDto.userId,
    );

    const checkUserExist = this.userRepository.findOneByUserId(otherUserIdDto);
    if (!checkUserExist) {
      throw new BadRequestException('유저 없음');
    }
    console.log(checkUserExist);
    const returnUser = await this.userRepository.blockUser(
      myUserIdDto,
      otherUserIdDto,
    );

    // auto 시리얼 라이징
    return returnUser.iBlockUsers;
  }
  @returnValueToDto(UserProfileDto)
  async upBlockUser(
    myUserIdDto: UserIdDto,
    otherUserIdDto: UserIdDto,
  ): Promise<UserProfileDto[]> {
    // auto 시리얼 라이징
    const user = await this.userRepository.unBlockUser(
      myUserIdDto,
      otherUserIdDto,
    );

    return user.iBlockUsers;
  }

  async reportUser(
    reporterIdDto: UserIdDto,
    reportedIdDto: UserIdDto,
  ): Promise<ReportResultDtoResDto> {
    //  신고당한 유저의 신고 갯수가 10개를 넘어가면 정지처리를 당해야함..

    //TODO : 테스트 끝나면 밑에 로직 넣기.

    const checkUser = await this.reportRepository.checkMyReportToOther(
      reporterIdDto,
      reportedIdDto,
    );
    if (checkUser) {
      // 이미 신고한 경우 한번이상
      return new ReportResultDtoResDto(false);
    }

    const reportedUserReportCount = await this.reportRepository.getReports(
      reportedIdDto,
    );

    if (reportedUserReportCount.length >= 10) {
      //TODO : 정지처리관련 인증서버로 요청보내기 or 유저 스테이트 변화 및 ttl 금지유저 레포 만들기
      console.log('유저 신고 갯수가 10회를 넘겼습니다.');
      const checkAlreadyBan = await this.authService.findOneForbiddenByUserId(
        reportedIdDto,
      );
      if (!checkAlreadyBan) {
        await this.authService.createForbidden(reportedIdDto);
      }
    }

    const report = await this.reportRepository.createReport(
      reporterIdDto,
      reportedIdDto,
    );
    if (!report) {
      return new ReportResultDtoResDto(false);
    }

    // auto 시리얼 라이징
    return new ReportResultDtoResDto(true);
  }

  async banUser(userIdDto: UserIdDto) {
    return await this.userRepository.banUser(userIdDto);
  }
  async unBanUser(userIdDto: UserIdDto) {
    return await this.userRepository.unBanuser(userIdDto);
  }

  @returnValueToDto(CanChangeNicknameResDto)
  async checkNicknameAndChangePossible(
    myUserIdDto: UserIdDto,
    nicknameDto: NicknameDto,
  ): Promise<CanChangeNicknameResDto> {
    const checkNickNameExist = await this.userRepository.findOneByNickname(
      nicknameDto,
    );

    const myRoomExist = await this.userRepository.getMyRoom(myUserIdDto);

    return {
      myRoomExist: myRoomExist ? true : false,
      nicknameExist: checkNickNameExist ? true : false,
      canChange: !myRoomExist && !checkNickNameExist ? true : false,
    };
  }

  @returnValueToDto(NewAlarmStateResDto)
  async toggleAlarmAlarm(myUserIdDto: UserIdDto): Promise<NewAlarmStateResDto> {
    const appAlarm = await this.userRepository.toggleApptAlarm(myUserIdDto);
    return { appAlarm: appAlarm };
  }

  @returnValueToDto(SendLightningSuccessDtoResDto)
  async sendLightningToUser(
    sender: UserIdDto,
    receive: UserIdDto,
    user: User,
  ): Promise<SendLightningSuccessDtoResDto> {
    const checkReportExist =
      await this.lightnignRepository.findOneLightningByUserId(sender, receive);
    console.log(checkReportExist);
    if (checkReportExist) {
      return { sendLightningSuccess: false };
    }

    const expireAt = new Date();
    if (expireAt.getUTCHours() >= 15) {
      expireAt.setUTCDate(expireAt.getUTCDate() + 1);
    }
    expireAt.setUTCHours(15, 0, 0, 0);

    // TODO : // 번개 방식 버그발견
    // utc 한국시간 기준으로 자정으로 설정
    // expireAt.setHours()
    const [_1, addUserScore, _2] = await Promise.all([
      this.lightnignRepository.saveLighting(sender, receive, expireAt),
      this.userRepository.addUserLigthningScore(receive),
      this.alarmService.storeLightningAlarm(user, receive),
    ]);

    switch (addUserScore.lightningScore) {
      case USER_LEVELUP_COUNT_TYPE.LEVEL1:
        await Promise.all([
          this.alarmService.handleLevelUpAlarm(receive, '1'),
          this.userRepository.levelUpUser(receive, USER_LEVEL_TYPE.LEVEL1),
        ]);
        break;
      case USER_LEVELUP_COUNT_TYPE.LEVEL2:
        await Promise.all([
          this.alarmService.handleLevelUpAlarm(receive, '2'),
          this.userRepository.levelUpUser(receive, USER_LEVEL_TYPE.LEVEL2),
        ]);
        break;
      case USER_LEVELUP_COUNT_TYPE.LEVEL3:
        await Promise.all([
          this.alarmService.handleLevelUpAlarm(receive, '3'),
          this.userRepository.levelUpUser(receive, USER_LEVEL_TYPE.LEVEL3),
        ]);
        break;
      default:
        break;
    }
    return { sendLightningSuccess: true };
  }

  @returnValueToDto(UserProfileDto)
  async getMyBlockUser(myUserIdDto: UserIdDto) {
    console.log('check');
    const user = await this.userRepository.findOneByUserId(myUserIdDto);
    if (!user) {
      throw new InternalServerErrorException('잘못된 접근');
    }

    return user.iBlockUsers;
  }

  @returnValueToDto(FCMUpdateDto)
  async updateUserFCMToken(
    myUserIdDto: UserIdDto,
    FCMToken: FCMUpdateDto,
  ): Promise<FCMUpdateDto> {
    // console.log('check');
    console.log(FCMToken);

    const updatedUserFCMToken = await this.userRepository.updateUserFCMToken(
      myUserIdDto,
      FCMToken,
    );
    console.log('asdfasdfasdfafsdF', updatedUserFCMToken);

    return { FCMToken: updatedUserFCMToken };
  }
}

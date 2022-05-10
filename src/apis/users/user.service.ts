import { UserRepository } from 'src/repositories/user.repository';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
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

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private reportRepository: ReportRepository,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
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
    return await this.userRepository.findOneByUserId(userIdDto);
  }

  @returnValueToDto(UserProfileDto)
  async getOtherUserInfo(
    userIdDto: UserIdDto,
    blockedUserDto: BlockedUserDto,
  ): Promise<UserProfileDto> {
    this.checkBlocked(userIdDto, blockedUserDto);
    // auto 시리얼 라이징
    return await this.userRepository.findOneByUserId(userIdDto);
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

  @returnValueToDto(User)
  async blockUser(
    myUserIdDto: UserIdDto,
    otherUserIdDto: UserIdDto,
  ): Promise<User> {
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
    console.log('asdfasdfasdfasdfasdf', returnUser);
    // auto 시리얼 라이징
    return returnUser;
  }
  @returnValueToDto(User)
  async upBlockUser(
    myUserIdDto: UserIdDto,
    otherUserIdDto: UserIdDto,
  ): Promise<User> {
    // auto 시리얼 라이징
    return await this.userRepository.unBlockUser(myUserIdDto, otherUserIdDto);
  }

  async reportUser(
    reporterIdDto: UserIdDto,
    reportedIdDto: UserIdDto,
  ): Promise<ReportResultDtoResDto> {
    //  신고당한 유저의 신고 갯수가 10개를 넘어가면 정지처리를 당해야함..

    //TODO : 테스트 끝나면 밑에 로직 넣기.

    // const checkUser = await this.reportRepository.checkMyReportToOther(
    //   reporter,
    //   reportedUser,
    // );
    // if (checkUser) {
    //   throw new BadRequestException('이미 신고한 유저입니다.');
    // }

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
}

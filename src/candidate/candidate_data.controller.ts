import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CandidateDataService } from './candidate_data.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CookieAuthenticationGuard } from 'src/auth/guards/cookie-auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { CandidateDocumentsDto } from './dto/candidate_documents.dto';
import { CandidateVerificationDto } from './dto/candidate_verification.dto';
import { UpdateCandidateDataDto } from './dto/update-candidate_data.dto';
import { StorageService } from 'src/3rd-party/storage/storage.service';
import { DownloadUploadDto } from './dto/download-upload.dto';
import {
  ApiGetCandidateDocuments,
  ApiGetDocumentTypes,
  ApiGetSignedURLForDownload,
  ApiGetSignedURLForUpload,
  ApiUpdateCandidateDocuments,
  ApiVerifyCandidateDocuments,
  ApiCandidateExperienceUpdate,
  ApiSearchCandidates,
} from './swagger/candidate_data.decorator';
import { SearchCandidateDto } from './dto/search-candidates.dto';

@ApiTags('candidate')
@Controller('candidate')
export class CandidateDataController {
  constructor(
    private readonly candidateDataService: CandidateDataService,
    private readonly storageService: StorageService,
  ) {}

  @ApiSearchCandidates()
  @Roles(['recruiter'])
  @UseGuards(CookieAuthenticationGuard, RolesGuard)
  @Get('/search')
  async searchCandidates(@Query() searchCandidateDto: SearchCandidateDto) {
    return this.candidateDataService.searchCandidates(searchCandidateDto);
  }

  @ApiGetDocumentTypes()
  @Roles(['candidate', 'admin'])
  @UseGuards(CookieAuthenticationGuard, RolesGuard)
  @Get('/document-types')
  async getDocumentTypes() {
    return this.candidateDataService.getDocumentTypes();
  }

  @ApiGetCandidateDocuments()
  @Roles(['candidate'])
  @UseGuards(CookieAuthenticationGuard, RolesGuard)
  @Get('/documents')
  async getDocuments(@Req() request: RequestWithUser) {
    return this.candidateDataService.getCandidateVerificationDocuments(
      request.user.id,
    );
  }

  @ApiGetSignedURLForDownload()
  @Roles(['candidate'])
  @UseGuards(CookieAuthenticationGuard, RolesGuard)
  @Post('/documents/download')
  async getDocument(
    @Req() request: RequestWithUser,
    @Body() downloadUploadDto: DownloadUploadDto,
  ) {
    const { filename } = downloadUploadDto;

    const candidateVerificationDocuments =
      await this.candidateDataService.getCandidateVerificationDocuments(
        request.user.id,
      );

    if (!candidateVerificationDocuments) {
      throw new HttpException('Document not found.', HttpStatus.NOT_FOUND);
    }

    const { personal_document_name, experience_document_name } =
      candidateVerificationDocuments;

    if (
      ![personal_document_name, experience_document_name].includes(filename)
    ) {
      throw new HttpException('Document not found.', HttpStatus.NOT_FOUND);
    }

    const signedURL = await this.storageService.generateSignedURLForDownload(
      request.user.id,
      filename,
    );

    return {
      signedURL,
    };
  }

  @ApiGetSignedURLForUpload()
  @Roles(['candidate'])
  @UseGuards(CookieAuthenticationGuard, RolesGuard)
  @Post('/documents/upload')
  async uploadDocument(
    @Req() request: RequestWithUser,
    @Body() downloadUploadDto: DownloadUploadDto,
  ) {
    const { filename } = downloadUploadDto;

    const signedURL = await this.storageService.generateSignedURLForUpload(
      request.user.id,
      filename,
    );

    return {
      signedURL,
    };
  }

  @ApiUpdateCandidateDocuments()
  @Roles(['candidate'])
  @UseGuards(CookieAuthenticationGuard, RolesGuard)
  @Put('/documents')
  async updateDocuments(
    @Req() request: RequestWithUser,
    @Body() candidateDocumentsDto: CandidateDocumentsDto,
  ) {
    return this.candidateDataService.updateCandidateVerificationDocuments(
      request.user.id,
      candidateDocumentsDto,
    );
  }

  @ApiVerifyCandidateDocuments()
  @ApiTags('admin')
  @Roles(['admin'])
  @UseGuards(CookieAuthenticationGuard, RolesGuard)
  @Put('/verification')
  async verifyCandidateDocuments(
    @Body() candidateVerificationDto: CandidateVerificationDto,
  ) {
    return this.candidateDataService.verifyCandidateDocuments(
      candidateVerificationDto,
    );
  }

  @ApiCandidateExperienceUpdate()
  @Roles(['candidate'])
  @UseGuards(CookieAuthenticationGuard, RolesGuard)
  @Put('experience')
  async updateExperience(
    @Req() request: RequestWithUser,
    @Body() updateCandidateDataDto: UpdateCandidateDataDto,
  ) {
    return this.candidateDataService.updateExperience(
      request.user,
      updateCandidateDataDto,
    );
  }
}

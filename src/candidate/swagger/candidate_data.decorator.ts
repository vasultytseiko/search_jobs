import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CandidateDocumentsExample,
  DocumentTypesExample,
  SearchCandidatesExample,
} from './candidate_data.examples';
import { DownloadUploadDto } from '../dto/download-upload.dto';
import { CandidateDocumentsDto } from '../dto/candidate_documents.dto';
import { CandidateVerificationDto } from '../dto/candidate_verification.dto';
import { UpdateCandidateDataDto } from '../dto/update-candidate_data.dto';

export function ApiGetDocumentTypes() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: 'Get document types for uploading verification documents.',
    }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description:
        'Returns document types, required for uploading verification documents.',
      schema: {
        example: DocumentTypesExample,
      },
    }),
  );
}

export function ApiGetCandidateDocuments() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary:
        'Get candidate verification documents info (filenames, statuses, types).',
    }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description:
        'Returns candidate verification documents if present, null - if not.',
      schema: {
        example: CandidateDocumentsExample,
      },
    }),
  );
}

export function ApiGetSignedURLForDownload() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: 'Get signed URL for downloading the verification document.',
    }),
    ApiBody({ type: DownloadUploadDto }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description:
        'Returns signed URL for downloading the verification document.',
      schema: {
        example: {
          signedURL: 'https://example.com/signed-url',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Document not found.',
    }),
  );
}

export function ApiGetSignedURLForUpload() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: 'Get signed URL for uploading the verification document.',
    }),
    ApiBody({ type: DownloadUploadDto }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description:
        'Returns signed URL for uploading the verification document.',
      schema: {
        example: {
          signedURL: 'https://example.com/signed-url',
        },
      },
    }),
  );
}

export function ApiUpdateCandidateDocuments() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: 'Update candidate documents (for candidate).',
      description: `
        If both type_id field and filename field (for example, personal_document_name and personal_document_type_id) are present, the document will be updated.
        If only one of them is present, the existing document will be treated as for deletion (if present in database).
        *_uploaded fields should be passed as "true" if the document is newly uploaded. If it's false, the document won't be viewed as for the update meaning it's the old version.
      `,
    }),
    ApiBody({ type: CandidateDocumentsDto }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description: 'Updates candidate verification documents.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description:
        'Creating the candidate verification failed. Please try again later.',
    }),
  );
}

export function ApiVerifyCandidateDocuments() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: 'Verify candidate documents (for admin).',
    }),
    ApiBody({ type: CandidateVerificationDto }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description: 'Updates candidate verification documents.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description:
        'Verifying the candidate documents failed. Please try again later.',
    }),
  );
}

export function ApiCandidateExperienceUpdate() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: 'Updates candidate experience and skills.',
    }),
    ApiBody({ type: UpdateCandidateDataDto }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description:
        'Updates candidate experience fields and skills of user. Returns the same updateCandidateDto object.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description:
        'Updating the experience data failed. Please try again later.',
    }),
  );
}

export function ApiSearchCandidates() {
  return applyDecorators(
    ApiCookieAuth('id'),
    ApiOperation({
      summary:
        'Search candidates by filters and skills, available only for recruiters.',
    }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description: 'Returns array of candidates by filters',
      schema: { example: SearchCandidatesExample },
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Forbidden resource',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'You must provide both: the distance and postcode to search by distance.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Searching candidates failed. Please try again later.',
    }),
  );
}

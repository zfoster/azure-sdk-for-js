/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

export {
  discriminators,
  AzureBackupServerContainer,
  AzureBackupServerEngine,
  AzureFileShareBackupRequest,
  AzureFileShareProtectableItem,
  AzureFileshareProtectedItem,
  AzureFileshareProtectedItemExtendedInfo,
  AzureFileShareProtectionPolicy,
  AzureFileShareProvisionILRRequest,
  AzureFileShareRecoveryPoint,
  AzureFileShareRestoreRequest,
  AzureIaaSClassicComputeVMContainer,
  AzureIaaSClassicComputeVMProtectableItem,
  AzureIaaSClassicComputeVMProtectedItem,
  AzureIaaSComputeVMContainer,
  AzureIaaSComputeVMProtectableItem,
  AzureIaaSComputeVMProtectedItem,
  AzureIaaSVMErrorInfo,
  AzureIaaSVMHealthDetails,
  AzureIaaSVMJob,
  AzureIaaSVMJobExtendedInfo,
  AzureIaaSVMJobTaskDetails,
  AzureIaaSVMProtectedItem,
  AzureIaaSVMProtectedItemExtendedInfo,
  AzureIaaSVMProtectionPolicy,
  AzureRecoveryServiceVaultProtectionIntent,
  AzureResourceProtectionIntent,
  AzureSQLAGWorkloadContainerProtectionContainer,
  AzureSqlContainer,
  AzureSqlProtectedItem,
  AzureSqlProtectedItemExtendedInfo,
  AzureSqlProtectionPolicy,
  AzureStorageContainer,
  AzureStorageErrorInfo,
  AzureStorageJob,
  AzureStorageJobExtendedInfo,
  AzureStorageJobTaskDetails,
  AzureStorageProtectableContainer,
  AzureVMAppContainerProtectableContainer,
  AzureVMAppContainerProtectionContainer,
  AzureVmWorkloadItem,
  AzureVmWorkloadProtectableItem,
  AzureVmWorkloadProtectedItem,
  AzureVmWorkloadProtectedItemExtendedInfo,
  AzureVmWorkloadProtectionPolicy,
  AzureVmWorkloadSAPAseDatabaseProtectedItem,
  AzureVmWorkloadSAPAseDatabaseWorkloadItem,
  AzureVmWorkloadSAPAseSystemProtectableItem,
  AzureVmWorkloadSAPAseSystemWorkloadItem,
  AzureVmWorkloadSAPHanaDatabaseProtectableItem,
  AzureVmWorkloadSAPHanaDatabaseProtectedItem,
  AzureVmWorkloadSAPHanaDatabaseWorkloadItem,
  AzureVmWorkloadSAPHanaSystemProtectableItem,
  AzureVmWorkloadSAPHanaSystemWorkloadItem,
  AzureVmWorkloadSQLAvailabilityGroupProtectableItem,
  AzureVmWorkloadSQLDatabaseProtectableItem,
  AzureVmWorkloadSQLDatabaseProtectedItem,
  AzureVmWorkloadSQLDatabaseWorkloadItem,
  AzureVmWorkloadSQLInstanceProtectableItem,
  AzureVmWorkloadSQLInstanceWorkloadItem,
  AzureWorkloadAutoProtectionIntent,
  AzureWorkloadBackupRequest,
  AzureWorkloadContainer,
  AzureWorkloadContainerExtendedInfo,
  AzureWorkloadErrorInfo,
  AzureWorkloadJob,
  AzureWorkloadJobExtendedInfo,
  AzureWorkloadJobTaskDetails,
  AzureWorkloadPointInTimeRecoveryPoint,
  AzureWorkloadPointInTimeRestoreRequest,
  AzureWorkloadRecoveryPoint,
  AzureWorkloadRestoreRequest,
  AzureWorkloadSAPHanaPointInTimeRecoveryPoint,
  AzureWorkloadSAPHanaPointInTimeRestoreRequest,
  AzureWorkloadSAPHanaRecoveryPoint,
  AzureWorkloadSAPHanaRestoreRequest,
  AzureWorkloadSQLAutoProtectionIntent,
  AzureWorkloadSQLPointInTimeRecoveryPoint,
  AzureWorkloadSQLPointInTimeRestoreRequest,
  AzureWorkloadSQLRecoveryPoint,
  AzureWorkloadSQLRecoveryPointExtendedInfo,
  AzureWorkloadSQLRestoreRequest,
  BackupEngineBase,
  BackupEngineBaseResource,
  BackupEngineExtendedInfo,
  BackupRequest,
  BackupRequestResource,
  BackupResourceConfig,
  BackupResourceConfigResource,
  BackupResourceVaultConfig,
  BackupResourceVaultConfigResource,
  BaseResource,
  BEKDetails,
  CloudError,
  ContainerIdentityInfo,
  DailyRetentionFormat,
  DailyRetentionSchedule,
  Day,
  DiskExclusionProperties,
  DiskInformation,
  DistributedNodesInfo,
  DpmBackupEngine,
  DpmContainer,
  DPMContainerExtendedInfo,
  DpmErrorInfo,
  DpmJob,
  DpmJobExtendedInfo,
  DpmJobTaskDetails,
  DPMProtectedItem,
  DPMProtectedItemExtendedInfo,
  EncryptionDetails,
  ErrorDetail,
  ExtendedProperties,
  GenericContainer,
  GenericContainerExtendedInfo,
  GenericProtectedItem,
  GenericProtectionPolicy,
  GenericRecoveryPoint,
  HealthDetails,
  IaasVMBackupRequest,
  IaaSVMContainer,
  IaasVMILRRegistrationRequest,
  IaaSVMProtectableItem,
  IaasVMRecoveryPoint,
  IaasVMRestoreRequest,
  ILRRequest,
  ILRRequestResource,
  InquiryInfo,
  InquiryValidation,
  InstantRPAdditionalDetails,
  Job,
  JobResource,
  KEKDetails,
  KeyAndSecretDetails,
  LogSchedulePolicy,
  LongTermRetentionPolicy,
  LongTermSchedulePolicy,
  MabContainer,
  MabContainerExtendedInfo,
  MABContainerHealthDetails,
  MabErrorInfo,
  MabFileFolderProtectedItem,
  MabFileFolderProtectedItemExtendedInfo,
  MabJob,
  MabJobExtendedInfo,
  MabJobTaskDetails,
  MabProtectionPolicy,
  MonthlyRetentionSchedule,
  PointInTimeRange,
  PreBackupValidation,
  PrivateEndpoint,
  PrivateEndpointConnection,
  PrivateEndpointConnectionResource,
  PrivateLinkServiceConnectionState,
  ProtectableContainer,
  ProtectableContainerResource,
  ProtectedItem,
  ProtectedItemResource,
  ProtectionContainer,
  ProtectionContainerResource,
  ProtectionIntent,
  ProtectionIntentResource,
  ProtectionPolicy,
  ProtectionPolicyResource,
  RecoveryPoint,
  RecoveryPointDiskConfiguration,
  RecoveryPointResource,
  RecoveryPointTierInformation,
  Resource,
  RestoreFileSpecs,
  RestoreRequest,
  RestoreRequestResource,
  RetentionDuration,
  RetentionPolicy,
  SchedulePolicy,
  Settings,
  SimpleRetentionPolicy,
  SimpleSchedulePolicy,
  SQLDataDirectory,
  SQLDataDirectoryMapping,
  SubProtectionPolicy,
  TargetAFSRestoreInfo,
  TargetRestoreInfo,
  WeeklyRetentionFormat,
  WeeklyRetentionSchedule,
  WorkloadInquiryDetails,
  WorkloadItem,
  WorkloadItemResource,
  WorkloadProtectableItem,
  WorkloadProtectableItemResource,
  YearlyRetentionSchedule
} from "../models/mappers";

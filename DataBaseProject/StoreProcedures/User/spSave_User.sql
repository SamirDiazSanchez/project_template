CREATE PROCEDURE [dbo].[spSave_User]
  @UserId UNIQUEIDENTIFIER = NULL,
  @UserName VARCHAR(500) = NULL,
  @Email VARCHAR(200) = NULL,
  @Role VARCHAR(100) = NULL,
  @RecordBy UNIQUEIDENTIFIER = NULL,
  @StatusCode INT OUTPUT,
  @StatusMessage VARCHAR(1000) OUTPUT
AS
SET NOCOUNT ON;
BEGIN
  DECLARE @CurrentData DATETIME = GETUTCDATE();

  IF @UserId IS NULL
  OR @UserName IS NULL
  OR @Email IS NULL
  OR @Role IS NULL
  OR @RecordBy IS NULL
    SET @StatusCode = 1;
    SET @StatusMessage = 'Parameter is required';

  IF @Role NOT IN ('admin', 'user')
    SET @StatusCode = 2;
    SET @StatusMessage = 'Invalid role';

  IF EXISTS (SELECT [UserId] FROM [User] WHERE [Email] = @Email)
    SET @StatusCode = 3;
    SET @StatusMessage = 'User already exists';

  BEGIN TRANSACTION;
  BEGIN TRY
    IF EXISTS (SELECT [UserId] FROM [User] WHERE [UserId] = @UserId)
     BEGIN
      UPDATE [dbo].[User]
      SET
        [UserName] = @UserName,
        [Role] = @Role,
        [UpdatedBy] = @RecordBy,
        [UpdatedAt] = @CurrentData,
        [IsActive] = 1
      WHERE [UserId] = @UserId;
    END
    ELSE
    BEGIN
      INSERT INTO [dbo].[User]
      (
        [UserId],
        [UserName],
        [Email],
        [Role],
        [CreatedBy],
        [CreatedAt],
        [UpdatedBy],
        [UpdatedAt]
      )
      VALUES
      (
        @UserId,
        @UserName,
        @Email,
        @Role,
        @RecordBy,
        @CurrentData,
        @RecordBy,
        @CurrentData
      );
    END

    COMMIT TRANSACTION;
    SET @StatusCode = 0;
    SET @StatusMessage = 'User saved successfully';
  END TRY
  BEGIN CATCH
    ROLLBACK TRANSACTION;
    SET @StatusCode = ERROR_NUMBER();
    SET @StatusMessage = ERROR_MESSAGE();
  END CATCH
END

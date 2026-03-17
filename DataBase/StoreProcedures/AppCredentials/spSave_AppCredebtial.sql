CREATE PROCEDURE [dbo].[spSave_AppCredebtial]
  @ClientId UNIQUEIDENTIFIER = NULL,
  @AppName VARCHAR(200) = NULL,
  @ClientSecret VARCHAR(64) = NULL,
  @RecordBy UNIQUEIDENTIFIER = NULL,
  @StatusCode INT OUTPUT,
  @StatusMessage VARCHAR(1000) OUTPUT
AS
SET NOCOUNT ON;
BEGIN
  DECLARE @CurrentDate DATETIME = GETUTCDATE();

  IF @ClientId IS NULL
  OR @AppName IS NULL
  OR @ClientSecret IS NULL
  OR @RecordBy IS NULL
  BEGIN
    SET @StatusCode = 1;
    SET @StatusMessage = 'Parameter is required';
    RETURN;
  END

  IF EXISTS (SELECT 1 FROM [dbo].[User] WHERE [Email] = @AppName AND [UserId] != @ClientId)
  BEGIN
    SET @StatusCode = 2;
    SET @StatusMessage = 'Application name already exists';
    RETURN;
  END

  BEGIN TRY
    BEGIN TRANSACTION

    IF EXISTS (SELECT 1 FROM [dbo].[AppCredential] WHERE [ClientId] = @ClientId)
    BEGIN
      UPDATE [dbo].[AppCredential]
      SET
        [ClientSecret] = @ClientSecret,
        [UpdatedBy] = @RecordBy,
        [UpdatedAt] = @CurrentDate,
        [IsActive] = 1
      WHERE [ClientId] = @ClientId;

      SET @StatusCode = 0;
      SET @StatusMessage = 'Application updated successfully';
      COMMIT TRANSACTION;
      RETURN;
    END

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
      @ClientId,
      @AppName,
      @AppName,
      'app',
      @RecordBy,
      @CurrentDate,
      @RecordBy,
      @CurrentDate
    );

    INSERT INTO [dbo].[AppCredential]
    (
      [ClientId],
      [ClientSecret],
      [IsActive],
      [CreatedBy],
      [CreatedAt],
      [UpdatedBy],
      [UpdatedAt]
    )
    VALUES
    (
      @ClientId,
      @ClientSecret,
      1,
      @RecordBy,
      @CurrentDate,
      @RecordBy,
      @CurrentDate
    );

    SET @StatusCode = 0;
    SET @StatusMessage = 'Application saved successfully';
    COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
    SET @StatusCode = ERROR_NUMBER();
    SET @StatusMessage = ERROR_MESSAGE();
    ROLLBACK TRANSACTION;
  END CATCH
END

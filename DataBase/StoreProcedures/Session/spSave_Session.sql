CREATE PROCEDURE [dbo].[spSave_Session]
  @SessionId UNIQUEIDENTIFIER = NULL,
  @UserId UNIQUEIDENTIFIER = NULL,
  @SessionHash VARCHAR(64) = NULL,
  @StatusCode INT OUT,
  @StatusMessage VARCHAR(1000) OUT
AS
SET NOCOUNT ON;
BEGIN
  DECLARE @CurrentData DATETIME = GETUTCDATE();

  IF @UserId IS NULL
  OR @SessionHash IS NULL
  BEGIN
    SET @StatusCode = 1;
    SET @StatusMessage = 'Parameter is require';
    RETURN;
  END

  BEGIN TRANSACTION
  BEGIN TRY
    IF EXISTS (SELECT 1 FROM [Session] WHERE [UserId] = @UserId AND [IsActive] = 1)
    BEGIN
      UPDATE [Session]
      SET [IsActive] = 0,
          [ClosedAt] = @CurrentData
      WHERE [UserId] = @UserId;
    END

    INSERT INTO [Session]
    VALUES (@SessionId, @UserId, @SessionHash, 1, @CurrentData, @CurrentData);

    COMMIT TRANSACTION;
    SET @StatusCode = 0;
    SET @StatusMessage = 'Session saved successfully'
  END TRY
  BEGIN CATCH
    ROLLBACK TRANSACTION;
    SET @StatusCode = ERROR_NUMBER();
    SET @StatusMessage = ERROR_MESSAGE()
  END CATCH
END
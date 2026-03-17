CREATE PROCEDURE [dbo].[spRemove_Session]
  @UserId UNIQUEIDENTIFIER = NULL,
  @StatusCode INT OUTPUT,
  @StatusMessage VARCHAR(1000) OUTPUT
AS
SET NOCOUNT ON;
BEGIN
  DECLARE @CurrentData DATETIME = GETUTCDATE();

  BEGIN TRANSACTION;
  BEGIN TRY
    UPDATE [Session]
    SET [ClosedAt] = @CurrentData,
        [IsActive] = 0
    WHERE [UserId] = @UserId;

    SET @StatusCode = 0;
    SET @StatusMessage = 'Session removed successfully';
    COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
    ROLLBACK TRANSACTION;
    SET @StatusCode = ERROR_NUMBER();
    SET @StatusMessage = ERROR_MESSAGE();
  END CATCH
END

CREATE PROCEDURE [dbo].[spRemove_User]
  @UserId UNIQUEIDENTIFIER = NULL,
  @RecordBy UNIQUEIDENTIFIER = NULL,
  @StatusCode INT OUTPUT,
  @StatusMessage VARCHAR(1000) OUTPUT
AS
SET NOCOUNT ON;
BEGIN
  DECLARE @CurrentData DATETIME = GETUTCDATE();

  IF @UserId IS NULL
  OR @RecordBy IS NULL
    SET @StatusCode = 1;
    SET @StatusMessage = 'Parameter is required';

  IF NOT EXISTS (SELECT [UserId] FROM [User] WHERE [UserId] = @UserId)
    SET @StatusCode = 2;
    SET @StatusMessage = 'User not found';

  BEGIN TRANSACTION;
  BEGIN TRY
    UPDATE [dbo].[User]
    SET
      [IsActive] = 0,
      [UpdatedBy] = @RecordBy,
      [UpdatedAt] = @CurrentData
    WHERE [UserId] = @UserId;

    COMMIT TRANSACTION;
    SET @StatusCode = 0;
    SET @StatusMessage = 'User removed successfully';
  END TRY
  BEGIN CATCH
    ROLLBACK TRANSACTION;
    SET @StatusCode = ERROR_NUMBER();
    SET @StatusMessage = ERROR_MESSAGE();
  END CATCH
END

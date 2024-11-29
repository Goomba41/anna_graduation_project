using backend.Models;

namespace backend
{
    public class Utils
    {
        public static void WriteActionToLog(UsersActivity action, AnnaGraduationProjectContext db)
        {
            action.Actiondate = DateTime.Now;

            db.UsersActivities.Add(action);
            db.SaveChanges();
        }

        /// <summary>
        /// Получение сообщения об ошибке (включая внутренние ошибки, используя разделитель)
        /// </summary>
        /// <param name="exception">ошибка</param>
        /// <param name="separator">разделитель</param>
        /// <returns>сообщение об ошибке</returns>
        public static string GetErrorMessageByException(Exception exception, string separator = "")
        {
            List<string> errorMessages = new List<string>();
            string stackTrace = $"StackTrace: {exception.StackTrace?.ToString()}";
            while (exception != null)
            {
                errorMessages.Add(exception.Message);
                exception = exception.InnerException == null ? exception : exception.InnerException;
            }
            errorMessages.Add(stackTrace);
            return string.Join(separator, errorMessages);
        }
    }
}
